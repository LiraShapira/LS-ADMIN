import { memo } from 'react';
import { LSEvent } from '../../types/EventTypes';
import LSEventItem from './LSEventItem';
import { useAppSelector } from '../../utils/hooks';
import { selectIsEditMode, selectSelectedEvent } from '../../store/eventsSlice';
import EditEvent from './EditEvent';

const LSEventsList = ({ events }: { events: LSEvent[] }) => {
  const isEditMode = useAppSelector(selectIsEditMode);
  const selectedEvent = useAppSelector(selectSelectedEvent);
  return (
    <div>
      {events.map((LSEvent) => {
        if (isEditMode && LSEvent.id === selectedEvent.id) {
          return (
            <div
              key={LSEvent.id}
              style={{ border: 'solid 2px black', margin: 8, padding: 4 }}
            >
              <EditEvent />
            </div>
          );
        } else {
          return (
            <div
              key={LSEvent.id}
              style={{ border: 'solid 2px black', margin: 8, padding: 4 }}
            >
              <LSEventItem LSEvent={LSEvent} />
            </div>
          );
        }
      })}
    </div>
  );
};

export default memo(LSEventsList);
