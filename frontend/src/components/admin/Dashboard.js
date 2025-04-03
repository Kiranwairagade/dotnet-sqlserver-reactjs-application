import React from 'react';
import './Dashboard.css';
import UserManagement from './UserManagement';
import Sidebar from '../common/Sidebar';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">               
          <div className="dashboard-card">          
            <UserManagement />
          </div>      
      </div>
    </div>
  );
};

export default Dashboard;