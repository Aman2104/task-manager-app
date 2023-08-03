import './App.css';
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LoginPage from './components/LoginPage';
import RegistrationForm from './components/Registration';
import AdminDashboard from './components/AdminDashboard'
export const TokenContext = createContext();
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const storeTokenInCookie = (token) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  };

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        return cookie.substring('token='.length, cookie.length);
      }
    }
    return null;
  };

  const token = getTokenFromCookie();
  const getUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${token}`,
        },
      });

      if (response.ok) {
        await response.json();
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to get user');
      }
    } catch (error) {
      console.error('Error getting user:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const verify = () => {
    setIsLoading(true);
    const token = getTokenFromCookie();
    if (token) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }


  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App">
      <TokenContext.Provider value={token}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route exact path="/" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
            <Route path="/addtask" element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage storeTokenInCookie={storeTokenInCookie} verify={verify} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<RegistrationForm storeTokenInCookie={storeTokenInCookie} verify={verify} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/admin" element={<AdminDashboard/>} />
          </Routes>
        </BrowserRouter>
      </TokenContext.Provider>
    </div>
  );
}

export default App;
