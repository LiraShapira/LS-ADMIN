import CompostStandsTab from './CompostStands/CompostStandsTab';
import { AppPage } from '../types/AppTypes';
import EventsTab from './events/EventsTab';
import UserTab from './user/UserTab';
import TransactionsTab from './transactions/TransactionsTab';
import DepositsTab from './transactions/DepositsTab';

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
      {currentPage === 'deposits' && <DepositsTab />}
    </div>
  );
};

export default DataDashBoard;
