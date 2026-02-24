import { ChangeEvent, useEffect, useState } from 'react';
import { User } from '../../../types/UserTypes';
import {
  CompostStandAdminParams,
  removeCompostAdmin,
  addCompostStandAdmin,
} from '../../../apiServices/CompostStandAdminApi';
import { verifyUser, toggleBanUser } from '../../../apiServices/userAPI';
import { fetchAllCompostStands, CompostStandFromAPI } from '../../../apiServices/CompostStandAPI';

interface UserItemProps {
  user: User;
  onUserUpdate?: () => void;
}

const UserItem = ({ user, onUserUpdate }: UserItemProps) => {
  const [adminStandId, setAdminStandId] = useState<string>('no');
  const [compostStands, setCompostStands] = useState<CompostStandFromAPI[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTogglingBan, setIsTogglingBan] = useState(false);

  useEffect(() => {
    fetchAllCompostStands().then((res) => {
      if ('data' in res && res.data) {
        setCompostStands(res.data);
      }
    });
  }, []);

  const onSelectNewStart = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentStandId = adminStandId;
    const newStandId = e.target.value;

    if (newStandId === 'no' && currentStandId !== 'no') {
      removeCompostAdmin({
        userId: user.id,
        compostStandId: Number(currentStandId),
      })
        .then((res) => {
          if ('data' in res) {
            setAdminStandId('no');
            if (onUserUpdate) {
              onUserUpdate();
            }
          } else {
            alert(res.message || 'Failed to remove compost stand admin');
            e.target.value = currentStandId;
          }
        })
        .catch((err) => {
          console.error('Error removing compost stand admin:', err);
          alert(err.message || 'Failed to remove compost stand admin');
          e.target.value = currentStandId;
        });
    } else if (newStandId !== 'no') {
      const params: CompostStandAdminParams = {
        userId: user.id,
        compostStandId: Number(newStandId),
      };
      addCompostStandAdmin(params)
        .then((res) => {
          if ('data' in res) {
            setAdminStandId(newStandId);
            if (onUserUpdate) {
              onUserUpdate();
            }
          } else {
            alert(res.message || 'Failed to add compost stand admin');
            e.target.value = currentStandId;
          }
        })
        .catch((err) => {
          console.error('Error adding compost stand admin:', err);
          alert(err.message || 'Failed to add compost stand admin');
          e.target.value = currentStandId;
        });
    }
  };

  useEffect(() => {
    if (user.adminCompostStandId) {
      setAdminStandId(String(user.adminCompostStandId));
    } else {
      setAdminStandId('no');
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
            value={adminStandId}
          >
            <option value='no'>no</option>
            {compostStands.map((stand) => (
              <option key={stand.compostStandId} value={stand.compostStandId}>
                {stand.displayName || stand.name_en || stand.name}
              </option>
            ))}
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
