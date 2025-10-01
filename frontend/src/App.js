import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import TaskDetail from './pages/TaskDetail.js';

function App() {
  const token = localStorage.getItem('token');

  const PrivateRoute = ({children}) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/task/:id" element={
              <PrivateRoute>
                <TaskDetail />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
