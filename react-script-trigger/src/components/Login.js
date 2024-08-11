import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formState, setFormState] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      navigate('/'); // Redirect to the main page after successful login
      window.location.reload(); // Force a page reload to clear old data
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="usernameOrEmail"
          placeholder="Username or Email"
          value={formState.usernameOrEmail}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleInputChange}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigate('/signup')}>
          Create an Account
        </button> {/* Button to navigate to the signup page */}
      </div>
    </div>
  );
}

export default Login;
