import { useEffect } from 'react';
import LSEventsList from './LSEventsList';
import AddOrEditEvent from './AddOrEditEvent';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { loadEvents, setEvents, selectEvents } from '../../store/eventsSlice';

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
        dispatch(setEvents(response.data));
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  return (
    <div>
      <div>Events:</div>
      <div>
        <AddOrEditEvent currentLSEvent={events[0]} />
      </div>
      <div>
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
