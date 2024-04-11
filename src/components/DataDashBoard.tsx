import CompostStandDataDisplay from './CompostStandDataDisplay';
import { AppPage } from '../types/AppTypes';
import EventsTab from './events/EventsTab';
import UserTab from './user/UserTab';

interface DataDashBoardProps {
  currentPage: AppPage;
}

const DataDashBoard = ({ currentPage }: DataDashBoardProps) => {
  return (
    <div className={'DataDashBoard'}>
      {currentPage === 'users' && <UserTab />}
      {currentPage === 'compostStands' && <CompostStandDataDisplay />}
      {currentPage === 'events' && <EventsTab />}
    </div>
  );
};

export default DataDashBoard;
