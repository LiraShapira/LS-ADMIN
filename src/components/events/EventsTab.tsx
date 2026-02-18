import { useEffect } from 'react';
import LSEventsList from './LSEventsList';
import AddEvent from './AddEvent';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { loadEvents, setEvents, selectEvents } from '../../store/eventsSlice';
import { DateTime } from 'luxon';
import {
  setIsModalVisible,
  setLoading,
  setModalText,
} from '../../store/appSlice';

const EventsTab = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const communityId = useAppSelector((state) => state.appState.selectedCommunityId);
  useEffect(() => {
    if (!communityId) return;
    dispatch(setLoading(true));
    dispatch(loadEvents())
      .unwrap()
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        const eventsInLocalTime = response.data.map((event) => ({
          ...event,
          endDate: DateTime.fromISO(event.endDate).toString(),
          startDate: DateTime.fromISO(event.startDate).toString(),
        }));
        dispatch(setEvents(eventsInLocalTime));
        dispatch(setLoading(false));
      })
      .catch((e) => {
        dispatch(setModalText(e.message));
        dispatch(setIsModalVisible(true));
        dispatch(setLoading(false));
        throw new Error(e);
      });
  }, [communityId]);

  return (
    <div>
      <div>Events:</div>
      <div>
        <AddEvent />
      </div>
      <div style={{ margin: 5 }}>
        {events.length ? (
          <LSEventsList events={events}></LSEventsList>
        ) : (
          <div> no events coming up</div>
        )}
      </div>
    </div>
  );
};

export default EventsTab;
