import { useRef, useState } from 'react';
import { go, learnersText } from '../data/appData.js';
import { useApp } from '../context/AppContext.jsx';
import { Arrow } from '../components/Shared.jsx';

export function WelcomeView() {
  const { user } = useApp();
  return (
    <section className="card panel welcome">
      <h1>Welcome, {user.name}</h1>
      <p className="meta">What would you like to do today?</p>
      <div className="act-grid">
        <div className="act-card">
          <span className="act-ic" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="7" r="4" />
              <path d="m10 10 3 3" />
            </svg>
          </span>
          <h2>Search Instructor</h2>
          <p>Find a course and join a team to learn together</p>
          <a className="act-link" href="#find">Browse courses <Arrow /></a>
        </div>
        <div className="act-card">
          <span className="act-ic" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
          </span>
          <h2>Offer Instruction</h2>
          <p>Post a course you can teach</p>
          <a className="act-link" href="#offer">Create a post <Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function NoteRow({ n, onDecide }) {
  const { learning, setCurrent } = useApp();
  const liRef = useRef(null);
  let title;
  let sub;
  let actions;

  if (n.kind === "request") {
    if (n.state === "pending") {
      title = n.who + " is interested in " + n.course;
      sub = n.sub;
    } else if (n.state === "accepted") {
      title = "You accepted " + n.who + " for " + n.course;
      sub = "Can join the classroom";
    } else {
      title = "You declined " + n.who + " for " + n.course;
      sub = "Request closed";
    }
    const decide = (state) => {
      liRef.current && liRef.current.focus();
      onDecide(n, state);
    };
    actions = (
      <div className="n-act">
        <span className="n-time">{n.time}</span>
        {n.state === "pending" ? (
          <>
            <button className="n-btn accept" type="button" aria-label={`Accept ${n.who} for ${n.course}`} onClick={() => decide("accepted")}>Accept</button>
            <button className="n-btn" type="button" aria-label={`Decline ${n.who} for ${n.course}`} onClick={() => decide("declined")}>Decline</button>
          </>
        ) : (
          <button className="n-btn" type="button" disabled>{n.state === "accepted" ? "Accepted" : "Declined"}</button>
        )}
      </div>
    );
  } else {
    const yes = n.result === "accepted";
    title = n.who + (yes ? " accepted your request" : " declined your request");
    sub = n.course + " : " + (yes ? "Join the classroom" : "try another course");
    actions = (
      <div className="n-act">
        <span className="n-time">{n.time}</span>
        <button
          className="n-link"
          type="button"
          onClick={() => {
            if (yes) {
              const c = learning.filter((x) => x.title === n.course)[0] || learning[0];
              setCurrent({ c, mode: "learner" });
              go("#classroom");
            } else go("#find");
          }}
        >
          {yes ? "Open classroom" : "Browse courses"}
        </button>
      </div>
    );
  }

  return (
    <li className="n-row" tabIndex={-1} ref={liRef}>
      <span className="n-av" aria-hidden="true" />
      <div className="n-txt">
        <p className="n-title">{title}</p>
        {sub && <p className="n-sub">{sub}</p>}
      </div>
      {actions}
    </li>
  );
}

export function NotificationView() {
  const { user, notes, setNotes } = useApp();
  const [status, setStatus] = useState("");
  const items = notes.filter(
    (n) =>
      user.role === "both" ||
      (user.role === "instructor" && n.kind === "request") ||
      (user.role === "learner" && n.kind === "update")
  );
  const onDecide = (n, state) => {
    setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, state, time: "today" } : x)));
    setStatus((state === "accepted" ? "Accepted " : "Declined ") + n.who + " for " + n.course);
  };
  return (
    <section className="card panel pg">
      <h1>Notification</h1>
      <p className="meta">Request and update about your courses</p>
      <ul className="n-list">
        {items.map((n) => (
          <NoteRow key={n.id} n={n} onDecide={onDecide} />
        ))}
      </ul>
      {items.length === 0 && (
        <p className="meta" style={{ marginTop: 28 }}>You are all caught up.</p>
      )}
      <p className="sr-only" aria-live="polite">{status}</p>
    </section>
  );
}

export function DashboardView() {
  const { learning, teaching, setCurrent } = useApp();
  const [tab, setTab] = useState("learning");
  const list = tab === "learning" ? learning : teaching;
  return (
    <section className="card panel pg">
      <h1>Dashboard</h1>
      <p className="meta">Your courses, all in one place</p>
      <div className="tabs" role="tablist" aria-label="Courses">
        <button className={"tab" + (tab === "learning" ? " on" : "")} role="tab" type="button" aria-selected={tab === "learning"} onClick={() => setTab("learning")}>
          Learning({learning.length})
        </button>
        <button className={"tab" + (tab === "teaching" ? " on" : "")} role="tab" type="button" aria-selected={tab === "teaching"} onClick={() => setTab("teaching")}>
          Teaching({teaching.length})
        </button>
      </div>
      <div className="dash-list">
        {list.map((c) => (
          <button
            key={c.title + c.link}
            className="row"
            type="button"
            onClick={() => {
              setCurrent({ c, mode: tab === "learning" ? "learner" : "teacher" });
              go("#classroom");
            }}
          >
            <span className="r-txt">
              <span className="r-title">{c.title}</span>
              <span className="r-sub">{tab === "learning" ? "with " + c.who : learnersText(c.learners)}</span>
            </span>
            <span className="go"><Arrow /></span>
          </button>
        ))}
      </div>
    </section>
  );
}
