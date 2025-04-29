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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-accent-500/30 rounded-full blur-xl"></div>
        
        <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in z-10">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 10 L 40 10 M 10 0 L 10 40" stroke="currentColor" strokeWidth="1" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary-600 rounded-xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-center font-display text-secondary-900">Welcome Back</h1>
          <p className="text-center text-secondary-500 mb-8">Sign in to your account to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-secondary-700 font-medium mb-2 text-sm">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-secondary-700 font-medium mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            {displayError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 animate-fade-in">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {displayError}
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 rounded-xl shadow-lg hover:shadow-xl"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              variant="accent"
              onClick={handleContinueAsGuest}
              className="w-full py-3 rounded-xl shadow-lg hover:shadow-xl"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 