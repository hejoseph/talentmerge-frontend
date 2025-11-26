import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>TalentMerge</h1>
          </div>
          
          {user && (
            <div className="header-actions">
              <span className="welcome-text">Welcome, {user.username}</span>
              <button className="btn logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;