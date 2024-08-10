import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function ProfilePage() {
  const [userData, setUserData] = useState({ name: '', username: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from local storage or API
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        // Example API call to fetch user details using the token
        const response = await fetch('http://localhost:3001/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmation) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        // API call to delete the user account
        const response = await fetch('http://localhost:3001/delete-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }

        alert('Account deleted successfully.');
        localStorage.removeItem('token');
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile</h2>
        <div className="profile-item">
          <strong>Name:</strong>
          <span>{userData.name}</span>
        </div>
        <div className="profile-item">
          <strong>Username:</strong>
          <span>{userData.username}</span>
        </div>
        <div className="profile-item">
          <strong>Email:</strong>
          <span>{userData.email}</span>
        </div>
        <div className="profile-item">
          <strong>Password:</strong>
          <span>********</span> {/* Masked password */}
        </div>
        <div className="profile-buttons">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className="delete-button">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
