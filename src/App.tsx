import React, { useState } from 'react';
import './App.css';
import DataDashBoard from './components/DataDashBoard';
import { AppPage } from './types/AppTypes';
import NavBar from './components/NavBar';
import { Provider } from 'react-redux';
import { store } from './store/index';
import Loader from './components/Loader';
import Modal from './components/Modal';

function App() {
  const [appDisplay, setAppDisplay] = useState<AppPage>('users');

  return (
    <Provider store={store}>
      <Loader>
        <Modal>
          <div className='App'>
            <div className='App-header'>
              <NavBar currentPage={appDisplay} setCurrentPage={setAppDisplay} />
              <DataDashBoard currentPage={appDisplay} />
            </div>
          </div>
        </Modal>
      </Loader>
    </Provider>
  );
}

export default App;
