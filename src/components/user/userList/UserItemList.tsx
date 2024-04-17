import { User } from '../../../types/UserTypes';
import UserItem from './UserItem';

const UserItemList = ({ users }: { users: User[] }) => {
  return (
    <div>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <UserItem user={user}></UserItem>
            <br></br>
          </div>
        );
      })}
    </div>
  );
};

export default UserItemList;
