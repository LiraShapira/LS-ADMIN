import { useState, useEffect } from 'react';
import { fetchUsers } from '../../apiServices/userAPI';
import { User } from '../../types/UserTypes';
import UserItemList from './userList/UserItemList';
import UserDataDisplay from '../UserDataDisplay';

const UserTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userListOpen, setUserListOpen] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers()
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setUsers(response.data);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <UserDataDisplay />
      <div style={{ flex: '1 0 200px' }}>
        <span>
          <h2 onClick={() => setUserListOpen((p) => !p)}>
            User List {userListOpen ? '🔽' : '▶'}
          </h2>
        </span>
        {userListOpen && <UserItemList users={users} />}
      </div>
    </div>
  );
};

export default UserTab;
