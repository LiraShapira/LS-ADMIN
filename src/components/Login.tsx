import React, { useState } from 'react';
import { useAppDispatch } from '../utils/hooks';
import { setAdmin, setLoading } from '../store/authSlice';
import { login } from '../apiServices/adminAPI';
import './Login.css';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const admin = await login(email, password);
      
      // Store admin ID in localStorage for auth token
      localStorage.setItem('adminId', admin.id);
      localStorage.setItem('admin', JSON.stringify(admin));
      
      dispatch(setAdmin(admin));
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="Login">
      <div className="Login-container">
        <h1>Lira Shapira Admin page</h1>
        <form onSubmit={handleSubmit}>
          <div className="Login-field">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>
          <div className="Login-field">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>
          {error && <div className="Login-error">{error}</div>}
          <button type="submit" disabled={isSubmitting} className="Login-button">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
