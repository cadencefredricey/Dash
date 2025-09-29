import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setErrorMsg(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 mt-4 rounded-md text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
