import { useEffect, useState } from 'react';
import { CompostStandDataDTO } from '../../types/ApiTypes';
import { 
  fetchCompostStandData, 
  fetchAllCompostStands, 
  createCompostStand, 
  updateCompostStand,
  CompostStandFromAPI 
} from '../../apiServices/CompostStandAPI';
import { useAppDispatch } from '../../utils/hooks';
import {
  setIsModalVisible,
  setLoading,
  setModalText,
} from '../../store/appSlice';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStandNameEn, setNewStandNameEn] = useState('');
  const [newStandNameHe, setNewStandNameHe] = useState('');
  const dispatch = useAppDispatch();

  const loadAllStands = async () => {
    try {
      const response = await fetchAllCompostStands();
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
    dispatch(setLoading(true));
    // TODO debounce
    fetchCompostStandData({
      period,
    })
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setCompostStandData(response.data);
        dispatch(setLoading(false));
      })
      .catch((e) => {
        dispatch(setModalText(e.message));
        dispatch(setIsModalVisible(true));
        dispatch(setLoading(false));
      });
    
    // Load all stands for management
    loadAllStands();
  }, [period]);

  const handleAddStand = async () => {
    if (!newStandNameEn.trim() || !newStandNameHe.trim()) {
      dispatch(setModalText('Please fill in both English and Hebrew names'));
      dispatch(setIsModalVisible(true));
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await createCompostStand({
        name_en: newStandNameEn.trim(),
        name_he: newStandNameHe.trim(),
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

  return (
    <div className={'DataDisplay'}>
      <h2 className={'DataDisplay__title'}>Compost Stand Data</h2>
      <PeriodSlider value={period} onChange={setPeriod} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Compost Stand Table</h1>
        {isStandsListVisible ? (
          <button onClick={() => setIsStandsListVisible(false)}>Hide list</button>
        ) : (
          <button onClick={() => setIsStandsListVisible(true)}>Show List</button>
        )}
      </div>
      {isStandsListVisible &&
        <>

          <span className='mobile-only'>Some data may not be viewable on mobile view</span>

          <CompostStandTable compostStandData={compostStandData} />
        </>
      }
      <CompostStandChart period={period} />

      {/* Management Section */}
      <div style={{ marginTop: '3rem', padding: '1rem', borderTop: '2px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Manage Compost Stands</h2>
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
        </div>

        {/* Stands Management Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Name (EN)</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Name (HE)</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {allStands.map((stand) => (
              <tr key={stand.compostStandId}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{stand.compostStandId}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{stand.name_en}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{stand.name_he}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    backgroundColor: stand.isActive ? '#d4edda' : '#f8d7da',
                    color: stand.isActive ? '#155724' : '#721c24'
                  }}>
                    {stand.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleActive(stand)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: stand.isActive ? '#dc3545' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {stand.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
