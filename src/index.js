import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

// Add server health check component
const AppWithServerCheck = () => {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    checkServer();
  }, []);

  if (serverStatus === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Checking server connection...</h1>
        <p>Please wait while we connect to the API server</p>
      </div>
    );
  }

  if (serverStatus === 'offline' || serverStatus === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Server Connection Failed</h1>
        <p className="mb-4">The JSON server appears to be offline or not responding correctly.</p>
        <div className="bg-yellow-100 p-4 rounded-lg max-w-md text-left">
          <p className="font-bold">Please run the following command in your terminal:</p>
          <div className="bg-gray-800 text-green-400 p-2 rounded mt-2 font-mono">
            npx json-server db.json
          </div>
          <p className="mt-2">Then refresh this page.</p>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithServerCheck />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
