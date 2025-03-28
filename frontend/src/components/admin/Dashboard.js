import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Welcome to Dashboard</h1>
        <p>{isAuthenticated ? "You are logged in!" : "Please log in."}</p>
      </div>
    </div>
  );
};

export default Dashboard;
