import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showDemo, setShowDemo] = useState(false);
  
  const { login, loading, error, user, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setFormData({
        username: 'admin',
        password: 'admin123'
      });
    } else {
      setFormData({
        username: 'testuser',
        password: 'test123'
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-title">TalentMerge</h1>
        <p className="login-subtitle">Welcome back! Please sign in to your account.</p>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <button
            type="button"
            className="demo-toggle"
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? 'Hide' : 'Show'} Demo Credentials
          </button>
          
          {showDemo && (
            <div className="demo-credentials">
              <p><strong>Demo Accounts:</strong></p>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="btn demo-btn"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  Admin User
                </button>
                <button
                  type="button"
                  className="btn demo-btn"
                  onClick={() => fillDemoCredentials('user')}
                >
                  Regular User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;