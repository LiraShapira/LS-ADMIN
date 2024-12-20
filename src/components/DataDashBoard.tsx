import CompostStandsTab from './CompostStands/CompostStandsTab';
import { AppPage } from '../types/AppTypes';
import EventsTab from './events/EventsTab';
import UserTab from './user/UserTab';
import TransactionsTab from './transactions/TransactionsTab';

interface DataDashBoardProps {
  currentPage: AppPage;
}

const DataDashBoard = ({ currentPage }: DataDashBoardProps) => {
  return (
    <div className={'DataDashBoard'}>
      {currentPage === 'users' && <UserTab />}
      {currentPage === 'compostStands' && <CompostStandsTab />}
      {currentPage === 'events' && <EventsTab />}
      {currentPage === 'transactions' && <TransactionsTab />}
    </div>
  );
};

export default DataDashBoard;
