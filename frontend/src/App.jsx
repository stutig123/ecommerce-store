import React, { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

function App() {
  const [user, setUser] = useState(null); // Store logged-in user info

  const handleLogin = (userData) => {
    setUser(userData); // userData will contain { username, role }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <h1>🛒 E-Commerce Store</h1>
      <p>Welcome, {user.username} ({user.role})</p>
      <button onClick={() => setUser(null)}>Logout</button>

      {user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}

export default App;
