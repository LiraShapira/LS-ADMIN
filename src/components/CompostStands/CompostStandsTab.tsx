import { useEffect, useState, useCallback } from 'react';

import * as XLSX from 'xlsx';

import { CompostStandDataDTO } from '../../types/ApiTypes';

import { 

  fetchCompostStandData,

  fetchCompostReports,

  backfillMissingCompostReports,

  fetchAllCompostStands, 

  createCompostStand, 

  updateCompostStand,

  CompostStandFromAPI,

} from '../../apiServices/CompostStandAPI';

import {

  formatLocalDateInput,

  getPeriodDateRange,

} from '../../utils/CompostStandUtils';

import { useAppDispatch, useAppSelector } from '../../utils/hooks';

import {

  setIsModalVisible,

  setLoading,

  setModalText,

} from '../../store/appSlice';

import { selectSelectedCommunityId } from '../../store/appSlice';

import CompostStandChart from './CompostStandChart';

import { CompostStandTable } from './CompostStandTable';

import PeriodSlider from '../PeriodSlider';



const initialUserData: CompostStandDataDTO = {

  depositsWeightsByStands: [],

  period: 30,

};



const CompostStandDataDisplay = () => {

  const [compostStandData, setCompostStandData] =

    useState<CompostStandDataDTO>(initialUserData);

  const [isStandsListVisible, setIsStandsListVisible] = useState(true);

  const [period, setPeriod] = useState<number>(30);

  const [allStands, setAllStands] = useState<CompostStandFromAPI[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newStandNameEn, setNewStandNameEn] = useState('');

  const [newStandNameHe, setNewStandNameHe] = useState('');

  const [addStandValidationError, setAddStandValidationError] = useState('');

  const [exportFromDate, setExportFromDate] = useState('');

  const [exportToDate, setExportToDate] = useState('');

  const dispatch = useAppDispatch();

  const communityId = useAppSelector(selectSelectedCommunityId);



  const loadAllStands = useCallback(async () => {

    if (!communityId) return;

    const response = await fetchAllCompostStands(communityId);

    if (response instanceof Error) {

      throw new Error(response.message);

    }

    if (response.data) {

      setAllStands(response.data);

    }

  }, [communityId]);



  useEffect(() => {

    if (!communityId) return;



    let cancelled = false;

    dispatch(setLoading(true));



    Promise.all([

      fetchCompostStandData({ period, communityId }),

      fetchAllCompostStands(communityId),

    ])

      .then(([standDataResponse, standsResponse]) => {

        if (cancelled) return;

        if (standDataResponse instanceof Error) {

          throw new Error(standDataResponse.message);

        }

        if (standsResponse instanceof Error) {

          throw new Error(standsResponse.message);

        }

        setCompostStandData(standDataResponse.data);

        setAllStands(standsResponse.data);

        dispatch(setLoading(false));

      })

      .catch((e) => {

        if (cancelled) return;

        dispatch(setModalText(e.message));

        dispatch(setIsModalVisible(true));

        dispatch(setLoading(false));

      });



    return () => {

      cancelled = true;

    };

  }, [period, communityId, dispatch]);



  useEffect(() => {

    const { from, to } = getPeriodDateRange(period);

    setExportFromDate(formatLocalDateInput(from));

    setExportToDate(formatLocalDateInput(to));

  }, [period]);



  const handleAddStand = async () => {

    if (!newStandNameEn.trim() || !newStandNameHe.trim()) {

      setAddStandValidationError('Both English and Hebrew name fields are required.');

      return;

    }



    try {

      setAddStandValidationError('');

      dispatch(setLoading(true));

      if (!communityId) {

        dispatch(setModalText('Please select a community first'));

        dispatch(setIsModalVisible(true));

        return;

      }

      const response = await createCompostStand({

        name_en: newStandNameEn.trim(),

        name_he: newStandNameHe.trim(),

        communityId,

      });



      if (response instanceof Error) {

        throw new Error(response.message);

      }



      setNewStandNameEn('');

      setNewStandNameHe('');

      setAddStandValidationError('');

      setIsAddModalOpen(false);



      await loadAllStands();

      dispatch(setLoading(false));

      dispatch(setModalText('Compost stand added successfully'));

      dispatch(setIsModalVisible(true));

    } catch (e: any) {

      dispatch(setLoading(false));

      dispatch(setModalText(e.message || 'Failed to add compost stand'));

      dispatch(setIsModalVisible(true));

    }

  };



  const handleToggleActive = async (stand: CompostStandFromAPI) => {

    try {

      dispatch(setLoading(true));

      const response = await updateCompostStand({

        compostStandId: stand.compostStandId,

        isActive: !stand.isActive,

      });



      if (response instanceof Error) {

        throw new Error(response.message);

      }



      await loadAllStands();

      dispatch(setLoading(false));

    } catch (e: any) {

      dispatch(setLoading(false));

      dispatch(setModalText(e.message || 'Failed to update compost stand'));

      dispatch(setIsModalVisible(true));

    }

  };



  const handleDownloadXlsx = async () => {

    if (!exportFromDate || !exportToDate) {

      dispatch(setModalText('Please select both start and end dates'));

      dispatch(setIsModalVisible(true));

      return;

    }



    if (!communityId) {

      dispatch(setModalText('Please select a community first'));

      dispatch(setIsModalVisible(true));

      return;

    }



    const from = new Date(`${exportFromDate}T00:00:00`);

    const to = new Date(`${exportToDate}T23:59:59.999`);



    if (from > to) {

      dispatch(setModalText('Start date must be earlier than end date'));

      dispatch(setIsModalVisible(true));

      return;

    }



    try {

      dispatch(setLoading(true));

      const reportsResponse = await fetchCompostReports({

        communityId,

        from: exportFromDate,

        to: exportToDate,

      });



      if (reportsResponse instanceof Error) {

        throw new Error(reportsResponse.message);

      }



      const allReports = reportsResponse.data || [];

      const standNameById: Record<number, string> = {};

      allStands.forEach((stand) => {

        standNameById[stand.compostStandId] = stand.displayName || stand.name_en || stand.name;

      });



      const uniqueUsersByStand: Record<number, Set<string>> = {};

      const depositCountByStand: Record<number, number> = {};

      const weightSumByStand: Record<number, number> = {};



      allReports.forEach((report) => {

        const standId = report.compostStandId;

        if (!depositCountByStand[standId]) {

          depositCountByStand[standId] = 0;

        }

        depositCountByStand[standId] += 1;

        const depositWeight = Number(report.depositWeight || 0);

        if (!weightSumByStand[standId]) {

          weightSumByStand[standId] = 0;

        }

        weightSumByStand[standId] += Number.isFinite(depositWeight) ? depositWeight : 0;



        if (report.userId) {

          if (!uniqueUsersByStand[standId]) {

            uniqueUsersByStand[standId] = new Set<string>();

          }

          uniqueUsersByStand[standId].add(report.userId);

        }

      });



      const rows = Object.keys(depositCountByStand)

        .map((standIdStr) => {

          const standId = Number(standIdStr);

          return {

            standId,

            standName: standNameById[standId] || `stand_${standId}`,

            totalWeightKg: Number((weightSumByStand[standId] || 0).toFixed(2)),

            depositCount: depositCountByStand[standId] || 0,

            averageDepositWeightKg: Number(

              (((weightSumByStand[standId] || 0) / Math.max(depositCountByStand[standId] || 0, 1))).toFixed(2)

            ),

            depositorsUsers: uniqueUsersByStand[standId]?.size || 0,

          };

        })

        .sort((a, b) => b.depositCount - a.depositCount);



      if (!rows.length) {

        dispatch(

          setModalText(

            `No deposits found between ${exportFromDate} and ${exportToDate}. Try widening the date range — recent deposits may fall outside the last ${period} days.`

          )

        );

        dispatch(setIsModalVisible(true));

        return;

      }



      const worksheet = XLSX.utils.json_to_sheet(rows);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'CompostStands');

      XLSX.writeFile(workbook, `compost-stands-${exportFromDate}-to-${exportToDate}.xlsx`);

    } catch (e: any) {

      dispatch(setModalText(e.message || 'Failed to export data'));

      dispatch(setIsModalVisible(true));

    } finally {

      dispatch(setLoading(false));

    }

  };



  const reloadCompostStandData = useCallback(async () => {
    if (!communityId) return;
    const standDataResponse = await fetchCompostStandData({ period, communityId });
    if (standDataResponse instanceof Error) {
      throw new Error(standDataResponse.message);
    }
    setCompostStandData(standDataResponse.data);
  }, [communityId, period]);



  const handleSyncMissingReports = async () => {
    if (!communityId) {
      dispatch(setModalText('Please select a community first'));
      dispatch(setIsModalVisible(true));
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await backfillMissingCompostReports({
        communityId,
        since: '2026-05-25T00:00:00',
      });
      if (response instanceof Error) {
        throw response;
      }
      await reloadCompostStandData();
      dispatch(
        setModalText(
          `Synced compost reports: ${response.data.created} created, ${response.data.skipped} skipped (${response.data.depositTransactions} deposit transactions checked).`
        )
      );
      dispatch(setIsModalVisible(true));
    } catch (e: any) {
      dispatch(setModalText(e.message || 'Failed to sync compost reports'));
      dispatch(setIsModalVisible(true));
    } finally {
      dispatch(setLoading(false));
    }
  };



  return (

    <div className={'DataDisplay'}>

      <h2 className={'DataDisplay__title'}>Compost Stand Data</h2>

      <PeriodSlider value={period} onChange={setPeriod} />
      {(compostStandData.totalDeposits === 0 ||
        compostStandData.depositsWeightsByStands.length === 0) && (
        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 10px 1rem' }}>
          No compost reports in the last {period} days. Deposits may exist as transactions only —
          use &quot;Sync missing reports&quot; below, or increase the day range.
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end', flexWrap: 'wrap', marginBottom: '1rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <label htmlFor='export-from-date'>From</label>

          <input

            id='export-from-date'

            type='date'

            value={exportFromDate}

            onChange={(e) => setExportFromDate(e.target.value)}

          />

        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <label htmlFor='export-to-date'>To</label>

          <input

            id='export-to-date'

            type='date'

            value={exportToDate}

            onChange={(e) => setExportToDate(e.target.value)}

          />

        </div>

        <button

          onClick={handleDownloadXlsx}

          style={{

            padding: '0.5rem 1rem',

            backgroundColor: '#1976d2',

            color: 'white',

            border: 'none',

            borderRadius: '4px',

            cursor: 'pointer',

            fontSize: '0.95rem'

          }}

        >

          Download XLSX

        </button>

        <button

          onClick={handleSyncMissingReports}

          style={{

            padding: '0.5rem 1rem',

            backgroundColor: '#6a1b9a',

            color: 'white',

            border: 'none',

            borderRadius: '4px',

            cursor: 'pointer',

            fontSize: '0.95rem'

          }}

        >

          Sync missing reports

        </button>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <h1>Compost Stand Table</h1>

        <div style={{ display: 'flex', gap: '0.5rem' }}>

          <button

            onClick={() => setIsAddModalOpen(true)}

            style={{

              padding: '0.5rem 1rem',

              backgroundColor: '#4CAF50',

              color: 'white',

              border: 'none',

              borderRadius: '4px',

              cursor: 'pointer',

              fontSize: '1rem'

            }}

          >

            + Add Stand

          </button>

          {isStandsListVisible ? (

            <button onClick={() => setIsStandsListVisible(false)}>Hide list</button>

          ) : (

            <button onClick={() => setIsStandsListVisible(true)}>Show List</button>

          )}

        </div>

      </div>

      {isStandsListVisible &&

        <>



          <span className='mobile-only'>Some data may not be viewable on mobile view</span>



          <CompostStandTable

            compostStandData={compostStandData}

            allStands={allStands}

            onToggleActive={handleToggleActive}

          />

        </>

      }

      <CompostStandChart period={period} />



      {/* Add Stand Modal */}

      {isAddModalOpen && (

        <div style={{

          position: 'fixed',

          top: 0,

          left: 0,

          right: 0,

          bottom: 0,

          backgroundColor: 'rgba(0, 0, 0, 0.5)',

          display: 'flex',

          justifyContent: 'center',

          alignItems: 'center',

          zIndex: 1000

        }}>

          <div style={{

            backgroundColor: 'white',

            padding: '2rem',

            borderRadius: '8px',

            width: '90%',

            maxWidth: '500px'

          }}>

            <h2 style={{ marginTop: 0 }}>Add New Compost Stand</h2>

            <div style={{ marginBottom: '1rem' }}>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>

                English Name / Address:

              </label>

              <input

                type="text"

                value={newStandNameEn}

                onChange={(e) => {

                  setNewStandNameEn(e.target.value);

                  if (addStandValidationError) {

                    setAddStandValidationError('');

                  }

                }}

                placeholder="e.g., Cafe Shapira"

                style={{

                  width: '100%',

                  padding: '0.5rem',

                  fontSize: '1rem',

                  border: '1px solid #ddd',

                  borderRadius: '4px',

                  boxSizing: 'border-box'

                }}

              />

            </div>

            <div style={{ marginBottom: '1.5rem' }}>

              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>

                שם בעברית \ כתובת:

              </label>

              <input

                type="text"

                value={newStandNameHe}

                onChange={(e) => {

                  setNewStandNameHe(e.target.value);

                  if (addStandValidationError) {

                    setAddStandValidationError('');

                  }

                }}

                placeholder="e.g., קפה שפירא"

                style={{

                  width: '100%',

                  padding: '0.5rem',

                  fontSize: '1rem',

                  border: '1px solid #ddd',

                  borderRadius: '4px',

                  boxSizing: 'border-box'

                }}

              />

            </div>

            {addStandValidationError && (

              <div style={{ marginBottom: '1rem', color: '#c62828', fontSize: '0.95rem' }}>

                {addStandValidationError}

              </div>

            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', zIndex: 1000 }}>

              <button

                onClick={() => {

                  setIsAddModalOpen(false);

                  setNewStandNameEn('');

                  setNewStandNameHe('');

                  setAddStandValidationError('');

                }}

                style={{

                  padding: '0.5rem 1rem',

                  backgroundColor: '#6c757d',

                  color: 'white',

                  border: 'none',

                  borderRadius: '4px',

                  cursor: 'pointer',

                  fontSize: '1rem'

                }}

              >

                Cancel

              </button>

              <button

                onClick={handleAddStand}

                style={{

                  padding: '0.5rem 1rem',

                  backgroundColor: '#4CAF50',

                  color: 'white',

                  border: 'none',

                  borderRadius: '4px',

                  cursor: 'pointer',

                  fontSize: '1rem'

                }}

              >

                Add Stand

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};



export default CompostStandDataDisplay;

