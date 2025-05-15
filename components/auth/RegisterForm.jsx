'use client';

import { useState, useEffect } from 'react';
import '@/styles/Auth.css';

export default function SignupForm({ onSubmit }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer', // default
    deposit: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Valid coin values
  const validCoins = [5, 10, 20, 50, 100];

  // Handle role change to manage deposit field
  useEffect(() => {
    if (form.role !== 'buyer') {
      // If not buyer, make sure deposit is removed from submission
      setForm(prev => ({ ...prev, deposit: undefined }));
    } else if (form.deposit === undefined) {
      // If switching back to buyer, initialize deposit with 0
      setForm(prev => ({ ...prev, deposit: 0 }));
    }
  }, [form.role]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
   
    // Handle different input types
    if (name === 'deposit') {
      // For deposit field, ensure only valid coin values are accepted
      const numValue = value === '' ? 0 : Number(value);
      if (value === '' || validCoins.includes(numValue)) {
        setForm(prev => ({ ...prev, [name]: numValue }));
        setError(null);
      } else {
        setError('Please select a valid coin value: 5, 10, 20, 50, or 100 cents');
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate deposit amount before submission
    if (form.role === 'buyer' && !validCoins.includes(form.deposit)) {
      setError('Please select a valid coin value: 5, 10, 20, 50, or 100 cents');
      setLoading(false);
      return;
    }

    // Prepare form data for submission
    const formData = { ...form };
   
    if (formData.role === 'buyer') {
      // Make sure deposit is a number
      formData.deposit = Number(formData.deposit);
    } else {
      // Remove deposit field for non-buyers
      delete formData.deposit;
    }

    const res = await onSubmit(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          {/* <option value="admin">Admin</option> */}
        </select>

        {/* Show deposit field only for buyers with fixed options for coins */}
        {form.role === 'buyer' && (
          <div className="coin-selection">
            <label>Initial Deposit (cents):</label>
            <select
              name="deposit"
              value={form.deposit}
              onChange={handleChange}
            >
              <option value="0">No initial deposit</option>
              <option value="5">5 cents</option>
              <option value="10">10 cents</option>
              <option value="20">20 cents</option>
              <option value="50">50 cents</option>
              <option value="100">100 cents</option>
            </select>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering…' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}