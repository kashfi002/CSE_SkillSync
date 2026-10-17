import { useRef, useState } from 'react';
import { ROLE_OPTIONS, go, toList } from '../data/appData.js';
import { useApp } from '../context/AppContext.jsx';
import { Chevron, Dropdown, PasswordField } from '../components/Shared.jsx';

export function HomeView() {
  return (
    <>
      <nav aria-label="Main">
        <a className="logo" href="#home" aria-label="CSE SkillSync home">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M5 4h13a8 8 0 0 1 0 16H11" stroke="#3fd6f5" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M27 28H14a8 8 0 0 1 0-16h7" stroke="#0b9fc2" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
          CSE SKILLSYNC
        </a>
      </nav>
      <section className="card big">
        <h1>Expand your skillset through give and take</h1>
        <p className="lede">CSE skill sync is an expertise sharing platform that allows you to take and offer courses for free</p>
        <a className="cta" href="#login">Login <Chevron /></a>
        <a className="cta" href="#signup">Sign up <Chevron /></a>
      </section>
    </>
  );
}

export function LoginView() {
  const { setLoggedIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    go("#welcome");
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
        <a className="link forgot" href="#forgot">Forgot password?</a>
        <button className="cta" type="submit">Log in</button>
        <a className="link alt" href="#signup">New here? Sign up</a>
      </form>
    </section>
  );
}

export function SignupView() {
  const { setUser, setLoggedIn } = useApp();
  const [f, setF] = useState({ name: "", inst: "", email: "", pass: "", offer: "", learn: "" });
  const [role, setRole] = useState("");
  const [roleInvalid, setRoleInvalid] = useState(false);
  const roleRef = useRef(null);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!role) {
      setRoleInvalid(true);
      roleRef.current && roleRef.current.focus();
      return;
    }
    setUser({
      name: f.name.trim(),
      inst: f.inst.trim(),
      role,
      bio: "",
      photo: "",
      offer: toList(f.offer),
      learn: toList(f.learn),
    });
    setLoggedIn(true);
    go("#profile");
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
        <button className="cta" type="submit">Create account</button>
      </form>
    </section>
  );
}
