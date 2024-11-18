
import './App.css';

import React from 'react';
import TaskManager from './TaskManager';

const App = () => {
  return (
    <div className="container mt-5 bg-con">
      <h1 className="text-center">Task Management App</h1>
      <TaskManager />
    </div>
  );
};

export default App;


