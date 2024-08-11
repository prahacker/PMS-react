import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import logo from '/path/to/react-script-trigger/src/assets/logo.webp';
import userIcon from '/path/to/react-script-trigger/src/assets/user.webp';
import './App.css';

function MainPage() {
  const [oneDayReturnData, setOneDayReturnData] = useState(null);
  const [sensexData, setSensexData] = useState(null);
  const [nifty50Data, setNifty50Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const fetchGraphData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      setOneDayReturnData(formatOneDayReturnData(jsonData));
      setSensexData(formatSensexData(jsonData));
      setNifty50Data(formatNifty50Data(jsonData));

      setLoading(false);
    } catch (error) {
      setError(`Failed to fetch data: ${error.toString()}`);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login if not authenticated
    }
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setOneDayReturnData(null);
    setSensexData(null);
    setNifty50Data(null);
    navigate('/login');
  };

  const runDriverScript = async () => {
    setLoading(true);  // Disable button while the script is running
    try {
      const response = await fetch('http://localhost:3001/run-script', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      alert(text);
      fetchGraphData();
    } catch (error) {
      console.error('Error running the script:', error);
      alert('Error running the script: ' + error.message);
    } finally {
      setLoading(false);  // Re-enable the button after the script has completed
    }
  };

  const formatOneDayReturnData = (jsonData) => {
    return {
      labels: jsonData.map(item => new Date(item.label).toLocaleDateString()),
      datasets: [{
        label: 'One Day Returns',
        data: jsonData.map(item => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    };
  };

  const formatSensexData = (jsonData) => {
    return {
      labels: jsonData.map(item => new Date(item.label).toLocaleDateString()),
      datasets: [{
        label: 'Sensex',
        data: jsonData.map(item => parseFloat(item.sensex)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }]
    };
  };

  const formatNifty50Data = (jsonData) => {
    return {
      labels: jsonData.map(item => new Date(item.label).toLocaleDateString()),
      datasets: [{
        label: 'Nifty 50',
        data: jsonData.map(item => parseFloat(item.nifty50)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }]
    };
  };

  const handleChartClick = (chartType) => {
    navigate(`/full-graph/${chartType}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="header-title">Financial Dashboard</h1>
        <div className="user-icon-container" onClick={toggleDropdown}>
          <img src={userIcon} alt="User Icon" className="user-icon" />
          {dropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <ul>
                <li onClick={() => navigate('/profile')}>Profile</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <h1>One Day Returns Chart</h1>
      <div className="chart-card" onClick={() => handleChartClick('one-day-return')}>
        {oneDayReturnData && <Line data={oneDayReturnData} options={{ responsive: true, maintainAspectRatio: false }} />}
      </div>

      <h1>Sensex Chart</h1>
      <div className="chart-card" onClick={() => handleChartClick('sensex')}>
        {sensexData && <Line data={sensexData} options={{ responsive: true, maintainAspectRatio: false }} />}
      </div>

      <h1>Nifty 50 Chart</h1>
      <div className="chart-card" onClick={() => handleChartClick('nifty50')}>
        {nifty50Data && <Line data={nifty50Data} options={{ responsive: true, maintainAspectRatio: false }} />}
      </div>

      <div className="buttons" style={{ marginTop: '20px' }}>
        <button onClick={runDriverScript} disabled={loading}>
          {loading ? 'Running...' : 'Run Driver Script'}
        </button>
        <button onClick={fetchGraphData}>Reload Graph Data</button>
      </div>
    </div>
  );
}

export default MainPage;
