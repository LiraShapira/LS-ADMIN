import { useState, useEffect } from 'react';
import { fetchUsers } from '../../apiServices/userAPI';
import { User } from '../../types/UserTypes';
import UserItemList from './userList/UserItemList';
import UserDataDisplay from '../UserDataDisplay';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
  setIsModalVisible,
  setLoading,
  setModalText,
} from '../../store/appSlice';
import { selectSelectedCommunityId } from '../../store/appSlice';
import { fetchAllCompostStands, CompostStandFromAPI } from '../../apiServices/CompostStandAPI';

const UserTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [compostStands, setCompostStands] = useState<CompostStandFromAPI[]>([]);
  const dispatch = useAppDispatch();
  const communityId = useAppSelector(selectSelectedCommunityId);

  useEffect(() => {
    if (!communityId) return;

    let cancelled = false;
    dispatch(setLoading(true));

    Promise.all([fetchUsers(communityId), fetchAllCompostStands(communityId)])
      .then(([usersResponse, standsResponse]) => {
        if (cancelled) return;
        if (usersResponse instanceof Error) {
          throw new Error(usersResponse.message);
        }
        if (standsResponse instanceof Error) {
          throw new Error(standsResponse.message);
        }
        setUsers(usersResponse.data);
        setCompostStands(standsResponse.data);
        dispatch(setLoading(false));
      })
      .catch((e) => {
        if (cancelled) return;
        dispatch(setLoading(false));
        dispatch(setModalText(e.message));
        dispatch(setIsModalVisible(true));
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, communityId]);

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


        <UserItemList 
          users={users.filter((user: any) => !user._hidden)} 
          compostStands={compostStands}
          onUserUpdate={() => {
            if (!communityId) return;
            dispatch(setLoading(true));
            fetchUsers(communityId)
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
              });
          }}
        />

      </div>
    </div>
  );
};

export default UserTab;
