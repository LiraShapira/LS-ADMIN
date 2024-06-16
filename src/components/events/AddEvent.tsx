import { FormEvent, useEffect, useState } from 'react';
import {
  fetchLocations,
  saveEventToDatabase,
} from '../../apiServices/EventsApi';
import { LSEvent, Location } from '../../types/EventTypes';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { selectEvents, setEvents } from '../../store/eventsSlice';
import { setLoading } from '../../store/appSlice';

const AddEvent = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchLocations()
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        setLocations(response.data);
        setSelectedLocationId(response.data[0].id);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  const onFormSubmit = (e: FormEvent) => {
    dispatch(setLoading(true));
    e.preventDefault();
    const newEvent: LSEvent = {
      // this id will be replaced by a random uuid in backend
      id: '123',
      title: eventTitle,
      description: eventDescription,
      startDate,
      endDate,
      attendees: [],
      // this id will be replaced by a random uuid in backend
      location: { id: selectedLocationId },
    };
    setEventTitle('');
    setEventDescription('');

    try {
      saveEventToDatabase(newEvent).then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        const LSEvents = response.data;
        // if  edit , then current event needs to be replaced instead of added
        dispatch(setEvents([...events, LSEvents]));
        dispatch(setLoading(false));
      });
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div>Add Event</div>
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor='name'>Title</label>
          <input
            name='title'
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='description'>description</label>
          <input
            name='description'
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='locations'></label>
          <select
            onChange={(e) => setSelectedLocationId(e.target.value)}
            name='locations'
          >
            {locations.map((location) => (
              <option value={location.name} key={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='startTime'>start time</label>
          <input
            onChange={(e) => setStartDate(e.target.value)}
            name='startTime'
            value={startDate}
            type='datetime-local'
          ></input>
        </div>
        <div>
          <label htmlFor='endTime'>end time</label>
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            name='endTime'
            type='datetime-local'
          ></input>
        </div>
        <button type='submit'>SUBMIT</button>
      </form>
    </div>
  );
};

export default AddEvent;
