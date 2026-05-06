import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { CompostStandDataDTO } from '../../types/ApiTypes';
import { 
  fetchCompostStandData, 
  fetchCompostReports,
  fetchAllCompostStands, 
  createCompostStand, 
  updateCompostStand,
  CompostStandFromAPI,
  CompostReportFromAPI
} from '../../apiServices/CompostStandAPI';
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
  depositsWeightsByStands: [
    {
      id: '9',
      name: 'burma',
      depositWeightSum: 148.92,
      averageDepositWeight: 18.62,
      depositCount: 8,
      depositUsersCount: 6,
    },
  ],
  period: 30,
};

const CompostStandDataDisplay = () => {
  const [compostStandData, setCompostStandData] =
    useState<CompostStandDataDTO>(initialUserData);
  const [isStandsListVisible, setIsStandsListVisible] = useState(true);
  const [period, setPeriod] = useState<number>(30);
  const [allStands, setAllStands] = useState<CompostStandFromAPI[]>([]);
  const [allReports, setAllReports] = useState<CompostReportFromAPI[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStandNameEn, setNewStandNameEn] = useState('');
  const [newStandNameHe, setNewStandNameHe] = useState('');
  const [exportFromDate, setExportFromDate] = useState('');
  const [exportToDate, setExportToDate] = useState('');
  const dispatch = useAppDispatch();
  const communityId = useAppSelector(selectSelectedCommunityId);

  const getDepositorsByStand = (reports: CompostReportFromAPI[], selectedPeriod: number): Record<number, number> => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - selectedPeriod);

    const byStand: Record<number, Set<string>> = {};
    reports.forEach((report) => {
      if (!report.date || !report.userId) {
        return;
      }
      const reportDate = new Date(report.date);
      if (Number.isNaN(reportDate.getTime()) || reportDate < from || reportDate > now) {
        return;
      }

      if (!byStand[report.compostStandId]) {
        byStand[report.compostStandId] = new Set<string>();
      }
      byStand[report.compostStandId].add(report.userId);
    });

    return Object.fromEntries(
      Object.entries(byStand).map(([standId, users]) => [Number(standId), users.size])
    );
  };

  const loadAllStands = async () => {
    if (!communityId) return;
    try {
      const response = await fetchAllCompostStands(communityId);
      if (response instanceof Error) {
        throw new Error(response.message);
      }
      if (response.data) {
        setAllStands(response.data);
      }
    } catch (e: any) {
      console.error('Error loading all stands:', e);
    }
  };

  useEffect(() => {
    if (!communityId) return;
    dispatch(setLoading(true));
    Promise.all([
      fetchCompostStandData({
        period,
        communityId,
      }),
      fetchCompostReports(communityId),
    ])
      .then(([standDataResponse, reportsResponse]) => {
        if (standDataResponse instanceof Error) {
          throw new Error(standDataResponse.message);
        }
        if (reportsResponse instanceof Error) {
          throw new Error(reportsResponse.message);
        }
        setAllReports(reportsResponse.data);
        const depositorsByStand = getDepositorsByStand(reportsResponse.data, period);
        const mergedData: CompostStandDataDTO = {
          ...standDataResponse.data,
          depositsWeightsByStands: standDataResponse.data.depositsWeightsByStands.map((stand) => ({
            ...stand,
            depositUsersCount: depositorsByStand[Number(stand.id)] || 0,
          })),
        };
        setCompostStandData(mergedData);
        dispatch(setLoading(false));
      })
      .catch((e) => {
        dispatch(setModalText(e.message));
        dispatch(setIsModalVisible(true));
        dispatch(setLoading(false));
      });
    
    loadAllStands();
  }, [period, communityId]);

  useEffect(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 30);

    const formatDateInput = (date: Date) => date.toISOString().split('T')[0];
    setExportFromDate(formatDateInput(from));
    setExportToDate(formatDateInput(now));
  }, []);

  const handleAddStand = async () => {
    if (!newStandNameEn.trim() || !newStandNameHe.trim()) {
      dispatch(setModalText('Please fill in both English and Hebrew names'));
      dispatch(setIsModalVisible(true));
      return;
    }

    try {
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

      // Reset form and close modal
      setNewStandNameEn('');
      setNewStandNameHe('');
      setIsAddModalOpen(false);
      
      // Reload stands
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

      // Reload stands
      await loadAllStands();
      dispatch(setLoading(false));
    } catch (e: any) {
      dispatch(setLoading(false));
      dispatch(setModalText(e.message || 'Failed to update compost stand'));
      dispatch(setIsModalVisible(true));
    }
  };

  const handleDownloadXlsx = () => {
    if (!exportFromDate || !exportToDate) {
      dispatch(setModalText('Please select both start and end dates'));
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

    const standNameById: Record<number, string> = {};
    allStands.forEach((stand) => {
      standNameById[stand.compostStandId] = stand.displayName || stand.name_en || stand.name;
    });

    const filtered = allReports.filter((report) => {
      if (!report.date) return false;
      const d = new Date(report.date);
      return !Number.isNaN(d.getTime()) && d >= from && d <= to;
    });

    const uniqueUsersByStand: Record<number, Set<string>> = {};
    const depositCountByStand: Record<number, number> = {};
    const weightSumByStand: Record<number, number> = {};
    filtered.forEach((report) => {
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
      dispatch(setModalText('No reports found for the selected date range'));
      dispatch(setIsModalVisible(true));
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CompostStands');
    XLSX.writeFile(workbook, `compost-stands-${exportFromDate}-to-${exportToDate}.xlsx`);
  };

  return (
    <div className={'DataDisplay'}>
      <h2 className={'DataDisplay__title'}>Compost Stand Data</h2>
      <PeriodSlider value={period} onChange={setPeriod} />
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
                English Name:
              </label>
              <input
                type="text"
                value={newStandNameEn}
                onChange={(e) => setNewStandNameEn(e.target.value)}
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
              <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                Name will be auto-generated: "{newStandNameEn.toLowerCase().replace(/\s+/g, '_')}"
              </small>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Hebrew Name:
              </label>
              <input
                type="text"
                value={newStandNameHe}
                onChange={(e) => setNewStandNameHe(e.target.value)}
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewStandNameEn('');
                  setNewStandNameHe('');
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
