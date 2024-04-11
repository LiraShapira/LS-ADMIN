import { User } from '../../../types/UserTypes';
import { standsIdToNameMap } from '../../../utils/CompostStandUtils';

const UserItem = ({ user }: { user: User }) => {
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
          <div>{user?.adminCompostStandId ? 'yes' : 'no'}</div>
        </span>
      </div>
      {user.adminCompostStandId && (
        <div>
          <div>{standsIdToNameMap[user.adminCompostStandId]}</div>
        </div>
      )}
    </div>
  );
};

export default UserItem;
