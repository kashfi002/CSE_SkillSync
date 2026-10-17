import { Chevron } from '../components/Shared.jsx';

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

