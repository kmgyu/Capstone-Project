import React from 'react';
import Calendar from './Calendar';
import TodoList from './TodoList'; 
import '../css/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <Calendar />
      <TodoList />
    </div>
  );
};

export default Dashboard;