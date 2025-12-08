import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1>TalentMerge</h1>
            </Link>
          </div>
          
          {user && (
            <>
              <nav className="header-nav">
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/resume-upload" 
                  className={`nav-link ${isActive('/resume-upload') ? 'active' : ''}`}
                >
                  Upload Resume
                </Link>
                <Link 
                  to="/candidates" 
                  className={`nav-link ${isActive('/candidates') ? 'active' : ''}`}
                >
                  Manage Candidates
                </Link>
              </nav>
              
              <div className="header-actions">
                <span className="welcome-text">Welcome, {user.username}</span>
                <button className="btn logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;