import { useEffect, useState } from 'react';
import { fetchUserData } from '../apiServices/userAPI';
import { UserData } from '../types/UserTypes';
import { convertUserData } from '../utils/UserDataUtils';


const UserDataDisplay = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [period, setPeriod] = useState<number>(30);

  useEffect(() => {
    // TODO debounce
    fetchUserData({
      period,
    })
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        if (!response.data) {
          throw new Error('No data received from server');
        }
        if (response.data instanceof Array) {
          setUserData(convertUserData(response.data));
        }
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, [period]);

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
      <div>PERIOD: {period} days</div>
      <input
        defaultValue={30}
        type={'number'}
        onChange={(e) => setPeriod(parseInt(e.target.value))}
        min={0}
      />
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
