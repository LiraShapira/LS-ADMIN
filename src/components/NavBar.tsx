import { AppPage } from '../types/AppTypes';
const classNames = require('classnames');

interface NavBarProps {
  currentPage: AppPage;
  setCurrentPage: React.Dispatch<React.SetStateAction<AppPage>>;
}

const NavBar = ({ currentPage, setCurrentPage }: NavBarProps) => {
  const onClick = (page: AppPage) => {
    setCurrentPage(page);
  };

  return (
    <div className={'NavBar'}>
      <button
        onClick={() => onClick('users')}
        // className={ currentPage === 'users' ? 'NavBar__selected' : '' }>
        className={classNames('NavBar__tab', {
          NavBar__selected: currentPage === 'users',
        })}
      >
        Users
      </button>
      <button
        onClick={() => onClick('compostStands')}
        className={classNames('NavBar__tab', {
          NavBar__selected: currentPage === 'compostStands',
        })}
      >
        Compost Stands
      </button>
      <button
        onClick={() => onClick('transactions')}
        className={classNames('NavBar__tab', {
          NavBar__selected: currentPage === 'transactions',
        })}
      >
        Transactions
      </button>
      <button
        onClick={() => onClick('events')}
        className={classNames('NavBar__tab', {
          NavBar__selected: currentPage === 'events',
        })}
      >
        Events
      </button>
    </div>
  );
};
export default NavBar;
