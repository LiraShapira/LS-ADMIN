import { useEffect, useState } from 'react';
import { fetchUserData } from '../apiServices/userAPI';
import { UserData } from '../types/UserTypes';

const initialUserData = {
  userCount: 0,
  newUserCount: 0,
  transactionsPerUser: [],
  averageTransactionsPerUser: 0,
  depositsPerUser: [],
  period: 0,
  balanceCounts: 0,
};

const UserDataDisplay = () => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
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
        setUserData(response.data);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, [period]);

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
      <div className={'DataDisplay__property'}>
        <span className='DataDisplay__key'>
          Average transactions per user:{' '}
        </span>
        <span className='DataDisplay__value'>
          {userData.averageTransactionsPerUser}
        </span>
      </div>
      <div className={' DataDisplay__property'}>
        <span className='DataDisplay__key'>New users</span>
        <span className='DataDisplay__value'>{userData.newUserCount}</span>
      </div>
      {/* TODO chart this */}
      {/*<div className={ ' DataDisplay__property' }>*/}
      {/*  <span className="DataDisplay__key">*/}
      {/*   Transactions Per User*/}
      {/*  </span>*/}
      {/*  <span className="DataDisplay__value">*/}
      {/*    { userData.transactionsPerUser }*/}
      {/*  </span>*/}
      {/*</div>*/}
    </div>
  );
};

export default UserDataDisplay;
