import { useState, useEffect } from 'react';
import { LSEvent } from '../../types/EventTypes';
import { fetchLSEventsData } from '../../apiServices/EventsApi';
import LSEventsList from './LSEventsList';
import AddEvent from './AddNewEvents';

const EventsTab = () => {
  const [events, setEvents] = useState<LSEvent[]>([]);
  useEffect(() => {
    fetchLSEventsData()
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setEvents(response.data);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  return (
    <div>
      <div>Events:</div>
      <div>
        <AddEvent setEvents={setEvents} />
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
