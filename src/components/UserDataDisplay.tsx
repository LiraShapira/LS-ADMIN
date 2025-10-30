import { useEffect, useState } from 'react';
import { fetchUserData } from '../apiServices/userAPI';
import { UserData } from '../types/UserTypes';
import { convertUserData } from '../utils/UserDataUtils';
import PeriodSlider from './PeriodSlider';


const UserDataDisplay = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [period, setPeriod] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO debounce
    fetchUserData({
      period,
    })
      .then((response) => {
        if (response instanceof Error) {
          console.error('Error fetching user data:', response.message);
          setError(response.message);
          return;
        }
        if (!response.data) {
          console.error('No data received from server');
          setError('No data received from server');
          return;
        }
        setUserData(convertUserData(response.data));
        setError(null);
      })
      .catch((e) => {
        console.error('Error in UserDataDisplay:', e);
        setError('An error occurred while fetching data');
      });
  }, [period]);

  if (error) {
    return (
      <div className={'DataDisplay'}>
        <h2 className={'DataDisplay__title'}>User Data</h2>
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>Error: {error}</p>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            The userStats endpoint is not yet implemented on the server.
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <div className={'DataDisplay'}>
      <h2 className={'DataDisplay__title'}>User Data</h2>
      <div className={'DataDisplay__property'}>
        <span className='DataDisplay__key'>
          <b>Total User Count:</b>
        </span>
        <span className='DataDisplay__value'>
          <b>{userData.userCount}</b>
        </span>
      </div>
      <PeriodSlider value={period} onChange={setPeriod} />
      <div className={' DataDisplay__property'}>
        <span className='DataDisplay__key'>Number of deposits</span>
        <span className='DataDisplay__value'>
          {userData.numberOfDeposits || 0}
        </span>
      </div>
      <div className={' DataDisplay__property'}>
        <span className='DataDisplay__key'>Average Number of Deposits for active users</span>
        <span className='DataDisplay__value'>
          {userData.averageNumberOfDepositsPerUser ? userData.averageNumberOfDepositsPerUser.toFixed(2) : 0}
        </span>
      </div>
      <div className={'DataDisplay__property'}>
        <span className='DataDisplay__key'>
          Average transactions per user:{' '}
        </span>
        <span className='DataDisplay__value'>
          {userData.averageTransactionsPerUser.toFixed(2)}
        </span>
      </div>
      <div className={' DataDisplay__property'}>
        <span className='DataDisplay__key'>New users</span>
        <span className='DataDisplay__value'>{userData.newUserCount}</span>
      </div>
    </div>
  );
};

export default UserDataDisplay;
