import { memo, useMemo } from 'react';
import { Attendee, LSEvent, Seller } from '../../types/EventTypes';
import { formatDate, formatTime } from '../../utils/timeAndDate';
import SellerItem from './SellerItem';
import { useAppDispatch } from '../../utils/hooks';
import { setIsEditMode, setSelectedEvent } from '../../store/eventsSlice';

export function isSeller(attendee: Attendee): attendee is Seller {
  return attendee.role === 'seller';
}

const LSEventItem = ({ LSEvent }: { LSEvent: LSEvent }) => {
  const dispatch = useAppDispatch();

  const {
    endDateFormatted,
    endTimeFormatted,
    startDateFormatted,
    startTimeFormatted,
    sellers,
  } = useMemo(() => {
    const sellers = LSEvent.attendees.filter(isSeller);
    const items = sellers.reduce((acc: string[], currentSeller: Seller) => {
      return [...acc, ...currentSeller.productsForSale];
    }, []);
    const startDate = new Date(LSEvent.startDate);
    const endDate = new Date(LSEvent.endDate);
    const startDateFormatted = formatDate(startDate);
    const startTimeFormatted = formatTime(startDate);

    const endDateFormatted = formatDate(endDate);
    const endTimeFormatted = formatTime(endDate);

    return {
      endDateFormatted,
      endTimeFormatted,
      items,
      startDateFormatted,
      sellers,
      startTimeFormatted,
    };
  }, [LSEvent.attendees, LSEvent.endDate, LSEvent.startDate]);

  const onClickEdit = () => {
    dispatch(setIsEditMode(true));
    dispatch(setSelectedEvent(LSEvent));
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={'DataDisplay__property'}>
          <span className='DataDisplay__key'>Title:</span>
          <span className='DataDisplay__value'>
            <span>{LSEvent.title} </span>
          </span>
        </div>
        <div className={'DataDisplay__property'}>
          <span className='DataDisplay__key'>description:</span>
          <span className='DataDisplay__value'>
            <span>{LSEvent.description} </span>
          </span>
        </div>
        <div className={'DataDisplay__property'}>
          <span className='DataDisplay__key'>location:</span>
          <span className='DataDisplay__value'>
            <span>{LSEvent.location.name} </span>
          </span>
        </div>
        <div className={'DataDisplay__property'}>
          <span className='DataDisplay__key'>Start Date :</span>
          <span className='DataDisplay__value'>
            <span>{startDateFormatted} </span>
          </span>
        </div>
        <div className={'DataDisplay__property'}>
          <span className='DataDisplay__key'>Start Time :</span>
          <span className='DataDisplay__value'>
            <span>{startTimeFormatted} </span>
          </span>
        </div>
        <div className={'DataDisplay__property'}>
          <span className='DataDisplay__key'>End Date :</span>
          <span className='DataDisplay__value'>
            <span>{endDateFormatted} </span>
          </span>
        </div>
        <div className={'DataDisplay__property'}>
          <span className='DataDisplay__key'>End Time :</span>
          <span className='DataDisplay__value'>
            <span>{endTimeFormatted} </span>
          </span>
        </div>
        <div>
          {sellers.length ? (
            <div>
              <strong>Sellers:</strong>
              {sellers.map((seller) => (
                <SellerItem
                  key={`${seller.user.id}-${LSEvent.id}`}
                  seller={seller}
                />
              ))}
            </div>
          ) : (
            <div>
              <strong>Sellers:</strong>
              <div>no sellers yet </div>
            </div>
          )}
        </div>
        <div>
          <strong>Attendees:</strong>
          {LSEvent.attendees.length ? (
            LSEvent.attendees.map((a) => (
              <span>
                {a.user.firstName} {a.user.lastName},
              </span>
            ))
          ) : (
            <div>no attendees yet </div>
          )}
        </div>
        <button onClick={onClickEdit}>Edit</button>
      </div>
    </div>
  );
};

export default memo(LSEventItem);
