'use client';

import '@/styles/Auth.css';

export default function LoginForm({ form, setForm, error, onSubmit, loading }) {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(form.email, form.password);
  };

  return (
    <div className="auth-container">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="full-width mb-4"
          type="text"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="full-width mb-4"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        {error && (
          <p className="error mb-4" style={{ color: 'var(--color-danger)' }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary full-width"
          disabled={loading}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
