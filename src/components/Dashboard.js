import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>
      
      <div className="dashboard-content">
        <div className="user-info card">
          <h3>User Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{user?.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user?.id}</span>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">👥</div>
            <h3>Talent Management</h3>
            <p>Manage and track talent across your organization with comprehensive profiles and analytics.</p>
            <button className="btn feature-btn">Coming Soon</button>
          </div>
          
          <div className="feature-card card">
            <div className="feature-icon">📊</div>
            <h3>Performance Analytics</h3>
            <p>Analyze performance metrics and generate insights to improve talent development.</p>
            <button className="btn feature-btn">Coming Soon</button>
          </div>
          
          <div className="feature-card card">
            <div className="feature-icon">🎯</div>
            <h3>Skills Assessment</h3>
            <p>Evaluate and track skill development with customizable assessment tools.</p>
            <button className="btn feature-btn">Coming Soon</button>
          </div>
          
          <div className="feature-card card">
            <div className="feature-icon">📈</div>
            <h3>Career Planning</h3>
            <p>Create development paths and career progression plans for your team members.</p>
            <button className="btn feature-btn">Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;