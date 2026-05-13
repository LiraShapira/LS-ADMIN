import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createLocation,
  fetchLocations,
  saveEventToDatabase,
} from '../../apiServices/EventsApi';
import { LSEvent, Location } from '../../types/EventTypes';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { selectEvents, setEvents } from '../../store/eventsSlice';
import { setLoading } from '../../store/appSlice';
import { selectSelectedCommunityId } from '../../store/appSlice';

const normalizeName = (s: string | undefined) =>
  (s ?? '').trim().toLowerCase();

const AddEvent = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const communityId = useAppSelector(selectSelectedCommunityId);
  const venueWrapRef = useRef<HTMLDivElement>(null);

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [venueInput, setVenueInput] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [venueListOpen, setVenueListOpen] = useState(false);
  const [venueError, setVenueError] = useState<string | null>(null);
  const [addingVenue, setAddingVenue] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!communityId) return;
    fetchLocations(communityId)
      .then((response) => {
        if (response instanceof Error) {
          throw new Error(response.message);
        }
        const list = response.data;
        setLocations(list);
        const first = list[0];
        if (first) {
          setSelectedLocationId(first.id);
          setVenueInput(first.name ?? '');
        } else {
          setSelectedLocationId('');
          setVenueInput('');
        }
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, [communityId]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!venueWrapRef.current?.contains(e.target as Node)) {
        setVenueListOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const filteredLocations = useMemo(() => {
    const q = normalizeName(venueInput);
    if (!q) return locations;
    return locations.filter((l) =>
      normalizeName(l.name).includes(q)
    );
  }, [locations, venueInput]);

  const trimmedVenueInput = venueInput.trim();
  const hasExactNameMatch = useMemo(() => {
    if (!trimmedVenueInput) return false;
    return locations.some(
      (l) => normalizeName(l.name) === trimmedVenueInput.toLowerCase()
    );
  }, [locations, trimmedVenueInput]);

  const showAddVenueButton =
    Boolean(trimmedVenueInput) &&
    !hasExactNameMatch &&
    Boolean(communityId) &&
    !addingVenue;

  const pickLocation = (loc: Location) => {
    setVenueInput(loc.name ?? '');
    setSelectedLocationId(loc.id);
    setVenueListOpen(false);
    setVenueError(null);
  };

  const onVenueInputChange = (value: string) => {
    setVenueInput(value);
    setVenueError(null);
    const t = value.trim();
    if (!t) {
      setSelectedLocationId('');
      return;
    }
    const match = locations.find(
      (l) => normalizeName(l.name) === t.toLowerCase()
    );
    setSelectedLocationId(match ? match.id : '');
  };

  const resolveLocationId = (): string | null => {
    if (selectedLocationId) return selectedLocationId;
    if (!trimmedVenueInput) return null;
    const byName = locations.find(
      (l) => normalizeName(l.name) === trimmedVenueInput.toLowerCase()
    );
    return byName ? byName.id : null;
  };

  const onAddVenueClick = async () => {
    if (!communityId || !trimmedVenueInput || addingVenue) return;
    setAddingVenue(true);
    dispatch(setLoading(true));
    setVenueError(null);
    try {
      const response = await createLocation({
        name: trimmedVenueInput,
        communityId,
      });
      if (response instanceof Error) {
        setVenueError(response.message);
        return;
      }
      const loc = response.data as Location;
      setLocations((prev) => [...prev, loc]);
      setVenueInput(loc.name ?? trimmedVenueInput);
      setSelectedLocationId(loc.id);
      setVenueListOpen(false);
    } catch (err: unknown) {
      setVenueError(err instanceof Error ? err.message : 'Could not add venue');
    } finally {
      setAddingVenue(false);
      dispatch(setLoading(false));
    }
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!communityId) {
      setVenueError('Select a community first.');
      return;
    }
    const locationId = resolveLocationId();
    if (!locationId) {
      setVenueError('Choose a venue from the list or add a new one.');
      return;
    }

    dispatch(setLoading(true));
    setVenueError(null);

    const newEvent: LSEvent = {
      id: '123',
      title: eventTitle,
      description: eventDescription,
      startDate,
      endDate,
      attendees: [],
      location: { id: locationId },
      communityId,
    };
    setEventTitle('');
    setEventDescription('');

    saveEventToDatabase(newEvent)
      .then((response) => {
        if (response instanceof Error) {
          setVenueError(response.message);
          return;
        }
        const LSEvents = response.data;
        dispatch(setEvents([...events, LSEvents]));
      })
      .catch((err) => {
        console.log(err);
        setVenueError(err instanceof Error ? err.message : 'Could not save event');
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <div>
      <div>Add Event</div>
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor='name'>Title</label>
          <input
            name='title'
            required
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='description'>description</label>
          <input
            required
            name='description'
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>
        <div ref={venueWrapRef} style={{ position: 'relative', marginBottom: 8 }}>
          <label htmlFor='venue-input'>Event venue</label>
          <input
            id='venue-input'
            name='venue'
            autoComplete='off'
            required
            value={venueInput}
            onChange={(e) => onVenueInputChange(e.target.value)}
            onFocus={() => setVenueListOpen(true)}
            placeholder='Type or pick a venue'
          />
          {venueListOpen && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                zIndex: 20,
                maxHeight: 220,
                overflowY: 'auto',
                border: '1px solid #ccc',
                background: '#fff',
                marginTop: 2,
              }}
            >
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {filteredLocations.map((location) => (
                  <li key={location.id}>
                    <button
                      type='button'
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => pickLocation(location)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        border: 'none',
                        background: 'transparent',
                        padding: '8px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      {location.name ?? location.id}
                    </button>
                  </li>
                ))}
              </ul>
              {showAddVenueButton && (
                <div style={{ padding: 8, borderTop: '1px solid #eee' }}>
                  <button
                    type='button'
                    disabled={addingVenue}
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={onAddVenueClick}
                  >
                    Add event venue
                  </button>
                </div>
              )}
            </div>
          )}
          {venueError && (
            <div role='alert' style={{ color: '#b00020', fontSize: 13, marginTop: 4 }}>
              {venueError}
            </div>
          )}
        </div>
        <div>
          <label htmlFor='startTime'>start time</label>
          <input
            onChange={(e) => setStartDate(e.target.value)}
            name='startTime'
            value={startDate}
            required
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
            required
            min={startDate}
          />
        </div>
        <button type='submit'>SUBMIT</button>
      </form>
    </div>
  );
};

export default AddEvent;
