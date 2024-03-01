import React, {useEffect, useState} from 'react';
import './App.css';
import {fetchUserStats} from "./apiServices/userAPI";

function App() {
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    fetchUserStats()
      .then((stats) => {
        // @ts-ignore
        setUserStats(stats.data);
    })
  }, [])
  return (
    <div className="App">
      <body className="App-header">
      <p>
        userStats
      </p>
      </body>
    </div>
  );
}

export default App;
