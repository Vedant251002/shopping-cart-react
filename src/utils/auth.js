// Utility functions for authentication

// Store user ID in localStorage
export const setUserId = (userId) => {
  localStorage.setItem('user_id', userId);
};

// Get user ID from localStorage
export const getUserId = () => {
  return localStorage.getItem('user_id');
};

// Check if user is authenticated (has valid user ID)
export const isAuthenticated = () => {
  const userId = getUserId();
  return userId && userId !== 'temp';
};

// Check if user is a guest (temp user)
export const isGuest = () => {
  return getUserId() === 'temp';
};

// Set user as guest
export const setAsGuest = () => {
  setUserId('temp');
};

// Clear user data (logout)
export const logout = () => {
  localStorage.removeItem('user_id');
}; 