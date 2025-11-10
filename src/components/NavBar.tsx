import { useEffect, useRef, useState } from 'react';
import { AppPage } from '../types/AppTypes';
import classNames from 'classnames';
import { useIsMobile } from '../utils/hooks';

interface NavBarProps {
  currentPage: AppPage;
  setCurrentPage: React.Dispatch<React.SetStateAction<AppPage>>;
}

const NavBar = ({ currentPage, setCurrentPage }: NavBarProps) => {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
        setMenuOpen(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onClick = (page: AppPage) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const navButtons = (
    <>
      <button
        onClick={() => onClick('users')}
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
        onClick={() => onClick('deposits')}
        className={classNames('NavBar__tab', {
          NavBar__selected: currentPage === 'deposits',
        })}
      >
        Deposits
      </button>
      <button
        onClick={() => onClick('events')}
        className={classNames('NavBar__tab', {
          NavBar__selected: currentPage === 'events',
        })}
      >
        Events
      </button>
    </>
  );

  return (
    <div
      className={classNames('NavBar', {
        'NavBar--hidden': !visible,
        'NavBar--visible': visible,
      })}
    >
      {isMobile && (
        <>
          <div
            className="NavBar__hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div
            className={classNames('NavBar__menu', {
              'NavBar__menu--open': menuOpen,
            })}
          >
            {navButtons}
          </div>
        </>
      )}
      {!isMobile && navButtons}
    </div>
  );
};
export default NavBar;
