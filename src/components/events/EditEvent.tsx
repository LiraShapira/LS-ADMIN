import { FormEvent, useEffect, useState } from 'react';
import { fetchLocations } from '../../apiServices/EventsApi';
import { LSEvent, Location } from '../../types/EventTypes';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import {
  selectIsEditMode,
  selectSelectedEvent,
  setEvents,
  updateEvent,
  setIsEditMode,
  deleteEvent,
  toggleDeleteCounter,
  selectDeleteCounter,
  selectEvents,
} from '../../store/eventsSlice';
import { DateTime } from 'luxon';
import {
  setIsModalVisible,
  setLoading,
  setModalText,
} from '../../store/appSlice';

const EditEvent = () => {
  const dispatch = useAppDispatch();
  const selectedEvent = useAppSelector(selectSelectedEvent);
  const LSEvents = useAppSelector(selectEvents);
  const deleteCounter = useAppSelector(selectDeleteCounter);
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

  const onClickDelete = () => {
    debugger;
    dispatch(setLoading(true));
    dispatch(toggleDeleteCounter());
    if (deleteCounter === 0) {
      dispatch(
        setModalText(
          'CAREFUL! You are about to delete the event: "' +
            selectedEvent.title +
            '" if you are sure you would like to do this, repeat the action'
        )
      );
      dispatch(setIsModalVisible(true));
      dispatch(setLoading(false));
    } else {
      try {
        dispatch(deleteEvent({ id: selectedEvent.id }))
          .unwrap()
          .then((response) => {
            if (response.data) {
              const newEventList = LSEvents.filter(
                (e) => e.id !== response.data.id
              );
              dispatch(setEvents(newEventList));
            }
            dispatch(setLoading(false));
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onFormSubmit = (e: FormEvent) => {
    dispatch(setLoading(true));
    e.preventDefault();
    const newEvent: Omit<LSEvent, 'attendees'> = {
      id: selectedEvent.id,
      title: eventTitle,
      description: eventDescription,
      startDate,
      endDate,
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
          dispatch(setEvents(LSEvents));
          dispatch(setIsEditMode(false));
        });
      dispatch(setLoading(false));
    } catch (e) {
      dispatch(setLoading(false));
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
            value={startDate.slice(0, 16)}
            onChange={(e) =>
              setStartDate(DateTime.fromISO(e.target.value).toString())
            }
            name='startTime'
            type='datetime-local'
          ></input>
        </div>
        <div>
          <label htmlFor='endTime'>end time</label>
          <input
            value={endDate.slice(0, 16)}
            onChange={(e) =>
              setEndDate(DateTime.fromISO(e.target.value).toString())
            }
            name='endTime'
            type='datetime-local'
          ></input>
        </div>
        <div style={{ display: 'flex', gap: 5, margin: 5 }}>
          <button type='submit' onClick={onFormSubmit}>
            SUBMIT
          </button>
          <button type='button' onClick={onClickDelete}>
            DELETE
          </button>
          <button type='button' onClick={onClickCancel}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
