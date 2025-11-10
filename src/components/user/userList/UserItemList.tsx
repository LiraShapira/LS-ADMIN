import { User } from '../../../types/UserTypes';
import UserItem from './UserItem';

interface UserItemListProps {
  users: User[];
  onUserUpdate?: () => void;
}

const UserItemList = ({ users, onUserUpdate }: UserItemListProps) => {
  return (
    <div>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <UserItem user={user} onUserUpdate={onUserUpdate}></UserItem>
            <br></br>
          </div>
        );
      })}
    </div>
  );
};

export default UserItemList;
