import { memo } from 'react';
import { LSEvent } from '../../types/EventTypes';
import LSEventItem from './LSEventItem';

const LSEventsList = ({ events }: { events: LSEvent[] }) => {
  return (
    <div>
      {events.map((LSEvent) => (
        <div
          key={LSEvent.id}
          style={{ border: 'solid 2px black', margin: 8, padding: 4 }}
        >
          <LSEventItem LSEvent={LSEvent} />
        </div>
      ))}
    </div>
  );
};

export default memo(LSEventsList);
