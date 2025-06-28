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
  // const [userListOpen, setUserListOpen] = useState<boolean>(true);
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

  const onFilterUsers = (search: string) => {
    const lowerSearch = search.toLowerCase();
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        _hidden: !(
          user.firstName.toLowerCase().includes(lowerSearch) ||
          user.lastName.toLowerCase().includes(lowerSearch) ||
          user.email?.toLowerCase().includes(lowerSearch) ||
          user.phoneNumber.includes(lowerSearch)
        ),
      }))
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <UserDataDisplay />
      <div>
        <h1 style={{ textAlign: 'center' }}>Users</h1>
        {/* <button
          style={{ width: 400, margin: 2, border: '2px solid black' }}
          onClick={() => setUserListOpen((p) => !p)}
        >
          {userListOpen ? 'Hide User List' : 'Show User List'}
        </button> */}
        <input
          type="text"
          placeholder="Search users..."
          style={{ width: 390, margin: '8px 0', padding: 4 }}
          onChange={(e) => onFilterUsers(e.target.value)}
        />


        <UserItemList users={users.filter((user: any) => !user._hidden)} />

      </div>
    </div>
  );
};

export default UserTab;
