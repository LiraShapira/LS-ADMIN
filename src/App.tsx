import React, {useState} from 'react';
import './App.css';
import DataDashBoard from "./components/DataDashBoard";
import {AppPage} from "./types/AppTypes";
import NavBar from "./components/NavBar";

function App() {
  const [appDisplay, setAppDisplay] = useState<AppPage>('users')

  return (
    <div className="App">
      <body className="App-header">
      <NavBar currentPage={ appDisplay } setCurrentPage={ setAppDisplay }/>
      <DataDashBoard currentPage={appDisplay}/>
      </body>
    </div>
  );
}

export default App;
