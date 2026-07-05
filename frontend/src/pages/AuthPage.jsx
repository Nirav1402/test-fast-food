import React from 'react';

function AuthPage({ authMode, authForm, onChange, onSubmit, onToggleMode }) {
  return (
    <section>
      <div className="card" style={{ maxWidth: 480 }}>
        <h2>{authMode === 'login' ? 'Sign in' : 'Create account'}</h2>
        <form className="form" onSubmit={onSubmit}>
          <input placeholder="Username" value={authForm.username} onChange={(e) => onChange('username', e.target.value)} required />
          {authMode === 'register' && <input placeholder="Email" type="email" value={authForm.email} onChange={(e) => onChange('email', e.target.value)} required />}
          <input placeholder="Password" type="password" value={authForm.password} onChange={(e) => onChange('password', e.target.value)} required />
          <div className="row">
            <button className="btn" type="submit">{authMode === 'login' ? 'Login' : 'Register'}</button>
            <button className="btn" type="button" style={{ background: '#111827' }} onClick={onToggleMode}>Switch to {authMode === 'login' ? 'Register' : 'Login'}</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AuthPage;
