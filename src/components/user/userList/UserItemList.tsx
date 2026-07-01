import { User } from '../../../types/UserTypes';
import { CompostStandFromAPI } from '../../../apiServices/CompostStandAPI';
import UserItem from './UserItem';

interface UserItemListProps {
  users: User[];
  compostStands: CompostStandFromAPI[];
  onUserUpdate?: () => void;
}

const UserItemList = ({ users, compostStands, onUserUpdate }: UserItemListProps) => {
  return (
    <div>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <UserItem user={user} compostStands={compostStands} onUserUpdate={onUserUpdate}></UserItem>
            <br></br>
          </div>
        );
      })}
    </div>
  );
};

export default UserItemList;
