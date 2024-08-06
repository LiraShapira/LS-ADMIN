import { useState, useEffect } from 'react';
import { fetchUsers } from '../../apiServices/userAPI';
import { User } from '../../types/UserTypes';
import UserItemList from './userList/UserItemList';
import UserDataDisplay from '../UserDataDisplay';
import { useAppDispatch } from '../../utils/hooks';
import {
  setIsModalVisible,
  setLoading,
  setModalText,
} from '../../store/appSlice';

const UserTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userListOpen, setUserListOpen] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUsers()
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setUsers(response.data);
        dispatch(setLoading(false));
      })
      .catch((e) => {
        dispatch(setLoading(false));
        dispatch(setModalText(e.message));
        dispatch(setIsModalVisible(true));
        throw new Error(e);
      });
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <UserDataDisplay />
      <div>
        <button
          style={{ width: 400, margin: 2, border: '2px solid black' }}
          onClick={() => setUserListOpen((p) => !p)}
        >
          <h2>User List {userListOpen ? '🔽' : '▶'}</h2>
        </button>
        {userListOpen && <UserItemList users={users} />}
      </div>
    </div>
  );
};

export default UserTab;
