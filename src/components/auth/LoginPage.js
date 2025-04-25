import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../layout/Button';
import { login } from '../../store/slices/authSlice';
import { authActions } from '../../store/slices/authSlice';
import { setAsGuest } from '../../utils/auth';
import { userApi } from '../../services/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setLocalError('Please enter both username and password');
      return;
    }
    
    setLocalError('');
    
    try {
      // Try direct login first
      const users = await userApi.getByCredentials(username, password);
      if (users && users.length > 0) {
        const user = users[0];
        dispatch(authActions.logout()); // Clear any previous state
        dispatch(login({ username, password }));
      } else {
        setLocalError('Invalid username or password');
      }
    } catch (err) {
      // Fall back to Redux login
      dispatch(login({ username, password }));
    }
  };
  
  const handleContinueAsGuest = () => {
    setAsGuest();
    dispatch(authActions.setAsGuest());
    navigate('/products');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {displayError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {displayError}
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">- OR -</p>
          <Button
            variant="secondary"
            onClick={handleContinueAsGuest}
            className="w-full py-3"
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 