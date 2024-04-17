import { ChangeEvent, useEffect, useState } from 'react';
import { User } from '../../../types/UserTypes';
import {
  standsIdToNameMap,
  standsNameToIdMap,
} from '../../../utils/CompostStandUtils';
import { CompostStandName } from '../../../types/CompostStandTypes';
import {
  CompostStandAdminParams,
  removeCompostAdmin,
  addCompostStandAdmin,
} from '../../../apiServices/CompostStandAdminApi';

const UserItem = ({ user }: { user: User }) => {
  const [adminStand, setAdminStand] = useState<CompostStandName | 'no'>('no');

  const onSelectNewStart = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentCompostStand = adminStand;
    const newCompostStand = e.target.value as CompostStandName | 'no';

    if (newCompostStand === 'no' && currentCompostStand !== 'no') {
      removeCompostAdmin({
        userId: user.id,
        compostStandId: standsNameToIdMap[currentCompostStand],
      })
        .then((res) => {
          if ('data' in res) {
            setAdminStand('no');
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (newCompostStand !== 'no') {
      const params: CompostStandAdminParams = {
        userId: user.id,
        compostStandId: standsNameToIdMap[newCompostStand],
      };
      addCompostStandAdmin(params).then((res) => {
        if ('data' in res) {
          setAdminStand(res.data.name);
        }
      });
    }
  };

  useEffect(() => {
    if (user.adminCompostStandId) {
      setAdminStand(standsIdToNameMap[user.adminCompostStandId]);
    }
  }, [user.adminCompostStandId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={'DataDisplay__property'}>
        <span className='DataDisplay__key'>Name:</span>
        <span className='DataDisplay__value'>
          <span>{user.firstName} </span>
          <span>{user.lastName}</span>
        </span>
      </div>
      <div className={'DataDisplay__property'}>
        <span className='DataDisplay__key'>Balance: </span>
        <span className='DataDisplay__value'>{user.accountBalance} LS</span>
      </div>
      <div className={'DataDisplay__property'}>
        <span className='DataDisplay__key'>Phone Number: </span>
        <span className='DataDisplay__value'>{user.phoneNumber}</span>
      </div>
      <div className={'DataDisplay__property'}>
        <span className='DataDisplay__key'>
          <div>Compost Stand owner:</div>
        </span>
        <span className='DataDisplay__value'>
          {/* <div>{user?.adminCompostStandId ? 'yes' : 'no'}</div> */}
          <select
            onChange={onSelectNewStart}
            name='compost_stands'
            id='compost-stands'
            value={adminStand || 'no'}
          >
            <option value='no'>no</option>
            {Object.values(standsIdToNameMap).map((stand) => {
              return (
                <option key={stand} value={stand}>
                  {stand}
                </option>
              );
            })}
          </select>
        </span>
      </div>
    </div>
  );
};

export default UserItem;
