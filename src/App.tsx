import React, { useState } from 'react';
import './App.css';
import DataDashBoard from './components/DataDashBoard';
import { AppPage } from './types/AppTypes';
import NavBar from './components/NavBar';

function App() {
  const [appDisplay, setAppDisplay] = useState<AppPage>('users');

  return (
    <div className='App'>
      <div className='App-header'>
        <NavBar currentPage={appDisplay} setCurrentPage={setAppDisplay} />
        <DataDashBoard currentPage={appDisplay} />
      </div>
    </div>
  );
}

export default App;
