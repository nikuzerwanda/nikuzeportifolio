import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import './admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { if (u) nav('/admin/dashboard'); });
    return unsub;
  }, [nav]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav('/admin/dashboard');
    } catch {
      setError(true);
    }
    setLoading(false);
  }

  return (
    <div className="admin-body login-page">
      <div className="login-card">
        <div className="login-logo">
          <p>Admin Portal</p>
          <h1>NIKUZE JOSELYNE</h1>
        </div>
        <form className="login-form" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="l-email">Email</label>
            <input id="l-email" type="email" placeholder="your@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="l-pass">Password</label>
            <input id="l-pass" type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <p className={`login-error${error ? ' show' : ''}`}>Invalid credentials. Please try again.</p>
          <button type="submit" className="btn-login" disabled={loading}>{loading ? 'SIGNING IN...' : 'SIGN IN'}</button>
        </form>
      </div>
    </div>
  );
}
