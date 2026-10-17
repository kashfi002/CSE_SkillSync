import { useState } from 'react';
import { go } from '../data/appData.js';
import { PasswordField } from '../components/Shared.jsx';
import { supabase } from '../lib/supabase.js';

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setIsError(false);
      go("#welcome");
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Unable to log in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!email.trim()) {
      setIsError(true);
      setMessage('Enter your email above first, then choose Forgot password.');
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setIsError(false);
      setMessage('If an account exists for this email, a password reset link is on its way.');
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Unable to send a reset link. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card small" aria-labelledby="loginTitle">
      <h1 id="loginTitle">Welcome back</h1>
      <p className="lede">Log in to CSE SkillSync</p>
      <form id="loginForm" onSubmit={submit}>
        <div className="field">
          <label className="sr-only" htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <PasswordField id="password" placeholder="Password" autoComplete="current-password" value={password} onChange={setPassword} />
        <button className="link forgot" type="button" onClick={resetPassword} disabled={busy}>Forgot password?</button>
        {message && <p className={`form-message${isError ? ' error' : ''}`} role="status">{message}</p>}
        <button className="cta" type="submit" disabled={busy}>{busy ? 'Please wait...' : 'Log in'}</button>
        <a className="link alt" href="#signup">New here? Sign up</a>
      </form>
    </section>
  );
}
