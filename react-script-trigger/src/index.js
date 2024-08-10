import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import FullScreenGraph from './components/FullScreenGraph';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProfilePage from './components/Profile'; // Import ProfilePage component
import './index.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Route for ProfilePage */}
        <Route path="/full-graph/:chartType" element={<FullScreenGraph />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
