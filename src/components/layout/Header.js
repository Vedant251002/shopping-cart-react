import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from './Button';
import { authActions } from '../../store/slices/authSlice';

const Header = ({ title = 'Shopping Cart' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, isGuest, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartItemCount = items.length;
  
  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/login');
  };
  
  const navigateToCart = () => {
    navigate('/cart');
  };
  
  const navigateToProducts = () => {
    navigate('/products');
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-800 shadow-lg relative z-10">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Logo and title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center cursor-pointer py-4" onClick={() => navigate('/')}>
                <div className="p-2 bg-white rounded-full shadow-md mr-3 animate-float">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white font-display tracking-wider drop-shadow-md">{title}</h1>
              </div>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <nav className="flex items-center space-x-4">
              <button
                onClick={navigateToProducts}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/products') 
                    ? 'bg-white text-primary-700 shadow-md transform -translate-y-1' 
                    : 'text-white hover:bg-white/20 hover:text-white'
                }`}
              >
                Products
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={navigateToCart}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                    isActive('/cart') 
                      ? 'bg-white text-primary-700 shadow-md transform -translate-y-1' 
                      : 'text-white hover:bg-white/20 hover:text-white'
                  }`}
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
            </nav>
            
            <div className="ml-4 flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {user && (
                    <div className="text-sm font-medium text-white bg-white/20 py-1.5 px-4 rounded-full backdrop-blur-sm">
                      <span className="opacity-80 mr-1">Hello,</span> {user.name}
                    </div>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-white text-white hover:bg-white hover:text-primary-700"
                  >
                    Logout
                  </Button>
                </div>
              ) : isGuest ? (
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="bg-white text-primary-700 hover:bg-accent-500 hover:text-white shadow-md"
                >
                  Login
                </Button>
              ) : (
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="bg-white text-primary-700 hover:bg-accent-500 hover:text-white shadow-md"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/20 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden animate-scaleIn backdrop-blur-md bg-primary-700/90">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <button
              onClick={navigateToProducts}
              className={`block px-4 py-3 rounded-xl text-base font-medium w-full text-left ${
                isActive('/products') 
                  ? 'bg-white text-primary-700 shadow-md' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Products
            </button>
            
            {isAuthenticated && (
              <button
                onClick={navigateToCart}
                className={`block px-4 py-3 rounded-xl text-base font-medium w-full text-left flex justify-between items-center ${
                  isActive('/cart') 
                    ? 'bg-white text-primary-700 shadow-md' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span>Cart</span> 
                {cartItemCount > 0 && (
                  <span className="bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            
            <div className="pt-4 border-t border-white/20">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  {user && (
                    <div className="text-sm font-medium text-white py-2 px-1">
                      Signed in as: <span className="font-bold">{user.name}</span>
                    </div>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    fullWidth
                    className="border-white text-white hover:bg-white hover:text-primary-700"
                  >
                    Logout
                  </Button>
                </div>
              ) : isGuest ? (
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  fullWidth
                  className="bg-white text-primary-700 hover:bg-accent-500 hover:text-white shadow-md"
                >
                  Login
                </Button>
              ) : (
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  fullWidth
                  className="bg-white text-primary-700 hover:bg-accent-500 hover:text-white shadow-md"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 