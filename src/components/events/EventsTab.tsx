import { useEffect } from 'react';
import LSEventsList from './LSEventsList';
import AddEvent from './AddEvent';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { loadEvents, setEvents, selectEvents } from '../../store/eventsSlice';
import { DateTime } from 'luxon';

const EventsTab = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  useEffect(() => {
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
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

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
