import { FormEvent, useEffect, useState } from 'react';
import { fetchLocations } from '../../apiServices/EventsApi';
import { LSEvent, Location } from '../../types/EventTypes';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
  selectIsEditMode,
  selectEvents,
  selectSelectedEvent,
  setEvents,
  updateEvent,
  setIsEditMode,
} from '../../store/eventsSlice';

const EditEvent = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const selectedEvent = useAppSelector(selectSelectedEvent);
  const isEditMode = useAppSelector(selectIsEditMode);
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

  useEffect(() => {
    setEventTitle(selectedEvent.title);
    setEventDescription(selectedEvent.description);
    setStartDate(selectedEvent.startDate);
    setEndDate(selectedEvent.endDate);
  }, [selectedEvent, isEditMode]);

  const onClickCancel = () => {
    dispatch(setIsEditMode(false));
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newEvent: LSEvent = {
      id: selectedEvent.id,
      title: eventTitle,
      description: eventDescription,
      startDate,
      endDate,
      attendees: [],
      location: { id: selectedLocationId },
    };
    setEventTitle('');
    setEventDescription('');

    try {
      dispatch(updateEvent(newEvent))
        .unwrap()
        .then((response) => {
          if (response instanceof Error) {
            throw new Error(response.message);
          }
          const LSEvents = response.data;
          dispatch(setEvents([...events, LSEvents]));
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
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
        <div style={{ display: 'flex', gap: 5, margin: 5 }}>
          <button type='submit'>SUBMIT</button>
          <button onClick={onClickCancel}>CANCEL</button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
