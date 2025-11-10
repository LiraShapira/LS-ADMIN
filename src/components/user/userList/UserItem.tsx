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
import { verifyUser, toggleBanUser } from '../../../apiServices/userAPI';

interface UserItemProps {
  user: User;
  onUserUpdate?: () => void;
}

const UserItem = ({ user, onUserUpdate }: UserItemProps) => {
  const [adminStand, setAdminStand] = useState<CompostStandName | 'no'>('no');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTogglingBan, setIsTogglingBan] = useState(false);

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

  const handleVerifyUser = async () => {
    setIsVerifying(true);
    try {
      const response = await verifyUser(user.id);
      if ('data' in response) {
        if (onUserUpdate) {
          onUserUpdate();
        }
      } else {
        alert(response.message || 'Failed to verify user');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to verify user');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleBan = async () => {
    setIsTogglingBan(true);
    try {
      const response = await toggleBanUser(user.id);
      if ('data' in response) {
        if (onUserUpdate) {
          onUserUpdate();
        }
      } else {
        alert(response.message || 'Failed to toggle ban status');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to toggle ban status');
    } finally {
      setIsTogglingBan(false);
    }
  };

  const isVerified = user.isVerified === true;
  const isBanned = user.isBanned === true;

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
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {!isVerified && (
          <button
            onClick={handleVerifyUser}
            disabled={isVerifying}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: isVerifying ? 'not-allowed' : 'pointer',
              opacity: isVerifying ? 0.6 : 1,
            }}
          >
            {isVerifying ? 'Verifying...' : 'Verify user'}
          </button>
        )}
        <button
          onClick={handleToggleBan}
          disabled={isTogglingBan}
          style={{
            padding: '8px 16px',
            backgroundColor: isBanned ? '#FF9800' : '#f44336',
            color: 'white',
            border: 'none',
            cursor: isTogglingBan ? 'not-allowed' : 'pointer',
            opacity: isTogglingBan ? 0.6 : 1,
          }}
        >
          {isTogglingBan ? 'Processing...' : isBanned ? 'Undo ban' : 'Ban user'}
        </button>
      </div>
    </div>
  );
};

export default UserItem;
