// frontend/src/components/admin/Dashboard.js
import React from 'react';
import './Dashboard.css';
import UserTable from './UsersPage.js';
import Sidebar from '../common/Sidebar';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="dashboard-card">
          <h2>Registered Users</h2>
          <UserTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
