import React, { useState, useEffect } from 'react';
import './App.css';
import DataDashBoard from './components/DataDashBoard';
import { AppPage } from './types/AppTypes';
import NavBar from './components/NavBar';
import CommunitySelector from './components/CommunitySelector';
import Login from './components/Login';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { useAppDispatch, useAppSelector } from './utils/hooks';
import { selectIsAuthenticated, selectIsAuthLoading, setAdmin, setLoading } from './store/authSlice';
import { selectIsSuperAdmin } from './store/authSlice';
import { getCurrentAdmin } from './apiServices/adminAPI';
import { setSelectedCommunityId } from './store/appSlice';
import Loader from './components/Loader';
import Modal from './components/Modal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AppContent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const admin = useAppSelector((state) => state.authState.admin);
  const [appDisplay, setAppDisplay] = useState<AppPage>('users');

  useEffect(() => {
    // Check if admin is stored in localStorage
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const adminId = localStorage.getItem('adminId');
        const storedAdmin = localStorage.getItem('admin');
        
        if (adminId && storedAdmin) {
          try {
            // Verify admin is still valid
            const currentAdmin = await getCurrentAdmin();
            dispatch(setAdmin(currentAdmin));
            
            // Set communityId from admin if not super admin
            if (!currentAdmin.isSuperAdmin && currentAdmin.communityId) {
              dispatch(setSelectedCommunityId(currentAdmin.communityId));
            }
          } catch (error) {
            // Admin session invalid, clear storage
            localStorage.removeItem('adminId');
            localStorage.removeItem('admin');
            dispatch(setAdmin(null));
          }
        } else {
          dispatch(setAdmin(null));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch(setAdmin(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  // Set communityId when admin changes (for non-super admins)
  useEffect(() => {
    if (admin && !admin.isSuperAdmin && admin.communityId) {
      dispatch(setSelectedCommunityId(admin.communityId));
    }
  }, [admin, dispatch]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Loader>
      <Modal>
        <div className='App'>
          <div>
            {isSuperAdmin && <CommunitySelector />}
            <NavBar currentPage={appDisplay} setCurrentPage={setAppDisplay} />
            <DataDashBoard currentPage={appDisplay} />
          </div>
        </div>
      </Modal>
    </Loader>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
