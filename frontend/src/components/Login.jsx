import React, { useState } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import './Login.css';

const API_URL = 'http://localhost:5000';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      setRole(res.data.role);
      setError('');
    } catch (err) {
      setError('❌ Invalid username or password');
    }
  };

  const handleLogout = () => {
    setRole('');
    setFormData({ email: '', password: '' });
  };

  if (role === 'admin') return <AdminDashboard onLogout={handleLogout} />;
  if (role === 'user') return <UserDashboard onLogout={handleLogout} />;

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
