import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function SignUp() {
  const [formState, setFormState] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email_id: formState.email,
          username: formState.username,
          password: formState.password
        })
      });
      if (!response.ok) {
        throw new Error('Sign-up failed');
      }
      alert('Sign-up successful. You can now log in.');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formState.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formState.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleInputChange}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={() => navigate('/login')}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default SignUp;
