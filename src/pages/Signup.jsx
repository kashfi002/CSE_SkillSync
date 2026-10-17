import { useRef, useState } from 'react';
import { ROLE_OPTIONS, go, toList } from '../data/appData.js';
import { Dropdown, PasswordField } from '../components/Shared.jsx';
import { supabase } from '../lib/supabase.js';

export function SignupView() {
  const [f, setF] = useState({ name: "", inst: "", email: "", pass: "", offer: "", learn: "" });
  const [role, setRole] = useState("");
  const [roleInvalid, setRoleInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const roleRef = useRef(null);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!role) {
      setRoleInvalid(true);
      roleRef.current && roleRef.current.focus();
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email: f.email.trim(),
        password: f.pass,
        options: {
          data: {
            name: f.name.trim(),
            inst: f.inst.trim(),
            role,
            bio: "",
            photo: "",
            offer: toList(f.offer),
            learn: toList(f.learn),
          },
        },
      });
      if (error) throw error;
      setIsError(false);
      if (data.session) {
        go("#profile");
      } else {
        setMessage('Check your email for a confirmation link. Once confirmed, come back and log in.');
      }
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Unable to create your account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card wide" aria-labelledby="signupTitle">
      <h1 id="signupTitle">Create Account</h1>
      <p className="lede">Join CSE SkillSync</p>
      <form id="signupForm" onSubmit={submit}>
        <div className="field">
          <label className="sr-only" htmlFor="su-name">Name</label>
          <input id="su-name" type="text" placeholder="Name" autoComplete="name" value={f.name} onChange={set("name")} required />
        </div>
        <div className="field">
          <label className="sr-only" htmlFor="su-inst">Institution</label>
          <input id="su-inst" type="text" placeholder="Institution" autoComplete="organization" value={f.inst} onChange={set("inst")} required />
        </div>
        <Dropdown
          ref={roleRef}
          id="roleDd"
          value={role}
          options={ROLE_OPTIONS}
          invalid={roleInvalid}
          onChange={(v) => {
            setRole(v);
            setRoleInvalid(false);
          }}
        />
        <div className="field">
          <label className="sr-only" htmlFor="su-email">Email</label>
          <input id="su-email" type="email" placeholder="Email" autoComplete="email" value={f.email} onChange={set("email")} required />
        </div>
        <PasswordField id="su-pass" placeholder="Password" autoComplete="new-password" value={f.pass} onChange={(v) => setF((p) => ({ ...p, pass: v }))} />
        <div className="field">
          <label className="sr-only" htmlFor="su-offer">Skills to offer</label>
          <input id="su-offer" type="text" placeholder="Skills to offer" value={f.offer} onChange={set("offer")} />
        </div>
        <div className="field">
          <label className="sr-only" htmlFor="su-learn">Skills to learn</label>
          <input id="su-learn" type="text" placeholder="Skills to learn" value={f.learn} onChange={set("learn")} />
        </div>
        {message && <p className={`form-message${isError ? ' error' : ''}`} role="status">{message}</p>}
        <button className="cta" type="submit" disabled={busy}>{busy ? 'Please wait...' : 'Create account'}</button>
      </form>
    </section>
  );
}
