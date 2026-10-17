import { useEffect, useRef, useState } from 'react';
import { MEMBERS, POOL, ROLES, go, summarize } from '../data/appData.js';
import { useApp } from '../context/AppContext.jsx';
import { Chips, RatingLine, Stars } from '../components/Shared.jsx';

function RatingsCard({ title }) {
  const { courseReviews } = useApp();
  const list = courseReviews(title);
  const sm = summarize(list);
  const notes = list.filter((r) => r.note).reverse().slice(0, 5);

  return (
    <div className="ratings">
      <p className="lbl" style={{ margin: 0 }}>Ratings</p>
      <div>
        {!sm.n ? (
          <p className="meta">No ratings yet. Learners can rate you from their classroom.</p>
        ) : (
          <div className="r-sum">
            <span className="r-big">{sm.avg.toFixed(1)}</span>
            <div>
              <Stars n={Math.round(sm.avg)} />
              <div className="r-sub">from {sm.n}{sm.n === 1 ? " learner" : " learners"}</div>
            </div>
          </div>
        )}
      </div>
      {sm.n > 0 && (
        <>
          <div>
            {[5, 4, 3, 2, 1].map((k) => (
              <div className="r-bar" key={k}>
                <span>{k}</span>
                <b><u style={{ width: (sm.dist[k] / sm.n) * 100 + "%" }} /></b>
                <span>{sm.dist[k]}</span>
              </div>
            ))}
          </div>
          <p className="lbl" style={{ margin: "12px 0 0" }}>Feedback</p>
          <div>
            {!notes.length && <p className="meta">No written feedback yet.</p>}
            {notes.map((r, i) => (
              <div className="r-fb" key={i}>
                <div className="r-who">
                  <span>Anonymous learner</span>
                  <Stars n={r.stars} />
                </div>
                {r.note}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ClassroomView() {
  const { user, cur, myReview, openRate, setViewMember } = useApp();
  const c = cur.c;
  const teacher = cur.mode === "teacher";
  const names = teacher ? POOL.slice(0, c.learners) : [user.name + " (You)"].concat(POOL.slice(0, 4));
  const mine = myReview(c.title);

  const [memOpen, setMemOpen] = useState(false);
  const memRef = useRef(null);
  const memBtnRef = useRef(null);
  useEffect(() => {
    if (!memOpen) return undefined;
    const onDoc = (e) => {
      if (memRef.current && !memRef.current.contains(e.target)) setMemOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [memOpen]);

  return (
    <section className="card panel pg classroom">
      <a className="back" href="#dashboard">← Back</a>
      <h1>{c.title} (Classroom)</h1>
      <p className="who">
        <span className="m-av" aria-hidden="true" />
        <button
          className="who-link"
          type="button"
          onClick={() => {
            if (teacher) {
              go("#profile");
              return;
            }
            setViewMember(c.who);
            go("#member");
          }}
        >
          {teacher ? user.name : c.who}
        </button>
        <span>&nbsp;&gt; Instructor</span>
      </p>
      <div className="cr-grid">
        <div>
          <div className="live">
            <div>
              <span className="lbl" style={{ margin: 0 }}>Live class</span>
              <span className="live-link">{c.link}</span>
            </div>
            <a className="mini fill" href={"https://" + c.link} target="_blank" rel="noopener noreferrer">Join Meeting</a>
          </div>
          <div className="docs-head">
            <span className="lbl" style={{ margin: 0 }}>Documents</span>
            {teacher && <button className="linkbtn add-doc" type="button" title="Coming soon">+Add documents</button>}
          </div>
          <div className="doc"><span className="d-ic" aria-hidden="true">PDF</span><span className="d-name">week 1 slides</span><button className="open-btn" type="button">open</button></div>
          <div className="doc"><span className="d-ic" aria-hidden="true">PDF</span><span className="d-name">practice problems</span><button className="open-btn" type="button">open</button></div>
          <div className="doc"><span className="d-ic" aria-hidden="true">Link</span><span className="d-name">Reference book link</span><button className="open-btn" type="button">open</button></div>
        </div>
        <div>
          <div
            className={"dd mem" + (memOpen ? " open" : "")}
            ref={memRef}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setMemOpen(false);
                memBtnRef.current && memBtnRef.current.focus();
              }
            }}
          >
            <button
              ref={memBtnRef}
              className="dd-btn"
              type="button"
              aria-haspopup="true"
              aria-expanded={memOpen}
              aria-controls="memList"
              onClick={() => setMemOpen((o) => !o)}
            >
              <span className="dd-label">Members ({names.length})</span>
            </button>
            <svg className="dd-chev" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <ul className="dd-list" id="memList" hidden={!memOpen}>
              {!names.length && <li>No members yet</li>}
              {names.map((n, i) => {
                const isYou = !teacher && i === 0;
                return (
                  <li key={n}>
                    <button
                      className="mem-item"
                      type="button"
                      onClick={() => {
                        setMemOpen(false);
                        if (isYou) {
                          go("#profile");
                          return;
                        }
                        setViewMember(n);
                        go("#member");
                      }}
                    >
                      <span className="m-av" aria-hidden="true" />
                      {n}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {!teacher && (
            <button className={"cta rate" + (mine ? " rated" : "")} type="button" aria-haspopup="dialog" onClick={openRate}>
              {mine ? `You rated ${mine.stars}/5 · Edit` : "Rate the instructor"}
            </button>
          )}
          {teacher && <RatingsCard title={c.title} />}
        </div>
      </div>
    </section>
  );
}

export function MemberView() {
  const { viewMember } = useApp();
  const m = MEMBERS[viewMember] || { inst: "", role: "learner", bio: "", offer: [], learn: [] };
  return (
    <section className="card panel pg">
      <a className="back" href="#classroom">← Back</a>
      <div className="p-head" style={{ marginTop: 14 }}>
        <div className="avatar" aria-hidden="true" />
        <div>
          <h1>{viewMember}</h1>
          <p className="meta">{ROLES[m.role] + (m.inst ? ", " + m.inst : "")}</p>
          <RatingLine name={viewMember} role={m.role} />
        </div>
      </div>
      <p className="lbl">Bio</p>
      <div className="bio-box">{m.bio}</div>
      <div className="skills">
        <div><p className="lbl">Skills to offer</p><Chips items={m.offer} /></div>
        <div><p className="lbl">Skills to learn</p><Chips items={m.learn} /></div>
      </div>
    </section>
  );
}
