import { useEffect, useRef, useState } from 'react';
import {
  ALL_VIEWS, APP_VIEWS, TITLES, makeCourses, makeLearning, makeNotes, makeReviews, makeTeaching, makeUser, summarize,
} from './data/appData.js';
import { AppContext } from './context/AppContext.jsx';
import AppShell from './components/AppShell.jsx';
import { RateDialog } from './pages/RateDialog.jsx';
import { HomeView, LoginView, SignupView } from './pages/PublicPages.jsx';

function CseSkillSync() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1));
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(makeUser);
  const [courses, setCourses] = useState(makeCourses);
  const [learning] = useState(makeLearning);
  const [teaching, setTeaching] = useState(makeTeaching);
  const [reviews, setReviews] = useState(makeReviews);
  const [notes, setNotes] = useState(makeNotes);
  const [current, setCurrent] = useState(null);
  const [viewMember, setViewMember] = useState("Abida");
  const [rate, setRate] = useState({ step: 1, stars: 0, hover: 0, note: "", err: false, sub: "", done: "" });
  const dlgRef = useRef(null);

  /* hash routing */
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const blocked = !loggedIn && APP_VIEWS.includes(hash);
  useEffect(() => {
    if (blocked) window.location.replace("#login");
  }, [blocked]);
  const view = blocked ? "login" : ALL_VIEWS.includes(hash) ? hash : "home";

  useEffect(() => {
    document.title = TITLES[view];
    window.scrollTo(0, 0);
  }, [view]);

  /* page-level body styles that the original set on <body> */
  useEffect(() => {
    const prev = { margin: document.body.style.margin, background: document.body.style.background };
    document.body.style.margin = "0";
    document.body.style.background = "#02070b";
    return () => {
      document.body.style.margin = prev.margin;
      document.body.style.background = prev.background;
    };
  }, []);

  /* ratings helpers */
  const instructorOf = (title) => {
    if (teaching.some((t) => t.title === title)) return user.name;
    const f = courses.filter((c) => c.title === title)[0];
    if (f) return f.by;
    const l = learning.filter((c) => c.title === title)[0];
    return l ? l.who : "";
  };
  const courseReviews = (title) => reviews.filter((r) => r.course === title);
  const instructorReviews = (name) => reviews.filter((r) => instructorOf(r.course) === name);
  const myReview = (title) => reviews.filter((r) => r.course === title && r.mine)[0];
  const summarizeInstructor = (title) => summarize(instructorReviews(instructorOf(title)));
  const setMine = (title, stars, note) =>
    setReviews((rs) => {
      const i = rs.findIndex((r) => r.course === title && r.mine);
      if (i > -1) return rs.map((r, j) => (j === i ? { ...r, stars, note } : r));
      return [...rs, { course: title, stars, note, mine: true }];
    });

  const cur = current || { c: learning[0], mode: "learner" };

  const openRate = () => {
    const c = cur.c;
    const r = myReview(c.title);
    setRate({
      step: 1,
      stars: r ? r.stars : 0,
      hover: 0,
      note: r ? r.note : "",
      err: false,
      sub: c.title + " · " + c.who,
      done: "",
    });
    if (dlgRef.current && !dlgRef.current.open) dlgRef.current.showModal();
  };
  const submitRate = (e) => {
    e.preventDefault();
    if (!rate.stars) {
      setRate((r) => ({ ...r, err: true }));
      return;
    }
    const c = cur.c;
    setMine(c.title, rate.stars, rate.note.trim());
    setRate((r) => ({
      ...r,
      step: 2,
      done: "You rated " + c.who + " " + rate.stars + "/5 for " + c.title + ".",
    }));
  };

  const logout = () => {
    setLoggedIn(false);
    setUser(makeUser());
    setCourses(makeCourses());
    setTeaching(makeTeaching());
    setReviews(makeReviews());
    setNotes(makeNotes());
    setCurrent(null);
    setViewMember("Abida");
    window.location.hash = "#home";
  };

  const ctx = {
    user, setUser, setLoggedIn, logout,
    courses, setCourses, learning, teaching, setTeaching,
    notes, setNotes,
    current, setCurrent, cur, viewMember, setViewMember,
    instructorOf, courseReviews, instructorReviews, myReview, summarizeInstructor,
    openRate,
  };

  const isApp = APP_VIEWS.includes(view);

  return (
    <AppContext.Provider value={ctx}>
            <div className="ss-root">
        <main className="hero">
          {/* Background text (all pages) */}
          <svg className="wordmark" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
            <defs>
              <linearGradient id="wmFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3fd6f5" stopOpacity=".55" />
                <stop offset="1" stopColor="#3fd6f5" stopOpacity="0" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="190"
              textAnchor="middle"
              fontFamily="Outfit, 'Segoe UI', sans-serif"
              fontWeight="600"
              fontSize="230"
              letterSpacing="6"
              fill="none"
              stroke="url(#wmFade)"
              strokeWidth="1.5"
            >
              CSE SKILLSYNC
            </text>
          </svg>

          {view === "home" && <HomeView />}
          {view === "login" && <LoginView />}
          {view === "signup" && <SignupView />}
          {isApp && <AppShell view={view} />}

          {/* Illustration */}
          <svg className="scene" viewBox="0 0 1200 420" aria-hidden="true">
            <defs>
              <radialGradient id="floor" cx="50%" cy="60%" r="55%">
                <stop offset="0" stopColor="#0b9fc2" stopOpacity=".45" />
                <stop offset="1" stopColor="#0b9fc2" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="track" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0a1a22" />
                <stop offset=".5" stopColor="#10303d" />
                <stop offset="1" stopColor="#061219" />
              </linearGradient>
              <linearGradient id="trackEdge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3fd6f5" stopOpacity="0" />
                <stop offset=".45" stopColor="#3fd6f5" stopOpacity=".9" />
                <stop offset="1" stopColor="#3fd6f5" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="cube" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#bff3ff" stopOpacity=".55" />
                <stop offset="1" stopColor="#3fd6f5" stopOpacity=".08" />
              </linearGradient>
              <filter id="blur"><feGaussianBlur stdDeviation="14" /></filter>
              <g id="cubeShape">
                <polygon points="0,10 36,0 70,12 34,24" fill="url(#cube)" stroke="#bff3ff" strokeOpacity=".85" />
                <polygon points="0,10 34,24 34,62 0,48" fill="url(#cube)" stroke="#bff3ff" strokeOpacity=".7" />
                <polygon points="34,24 70,12 70,50 34,62" fill="url(#cube)" stroke="#bff3ff" strokeOpacity=".5" />
              </g>
            </defs>
            <ellipse cx="600" cy="300" rx="520" ry="120" fill="url(#floor)" />
            <path d="M-20 330 C 220 250, 420 380, 640 330 S 1000 230, 1220 300 L1220 420 L-20 420 Z" fill="url(#track)" />
            <path d="M-20 330 C 220 250, 420 380, 640 330 S 1000 230, 1220 300" fill="none" stroke="url(#trackEdge)" strokeWidth="2.5" />
            <path d="M-20 346 C 220 266, 420 396, 640 346 S 1000 246, 1220 316" fill="none" stroke="#3fd6f5" strokeOpacity=".12" />
            <path d="M-20 366 C 220 286, 420 416, 640 366 S 1000 266, 1220 336" fill="none" stroke="#3fd6f5" strokeOpacity=".08" />
            <g transform="translate(405 150)">
              <polygon points="0,10 150,0 160,120 8,140" fill="#071218" stroke="#cfeaf2" strokeOpacity=".6" strokeWidth="1.5" />
              <g stroke="#bff3ff" strokeOpacity=".8" strokeWidth="1.2" fill="none">
                <path d="M18 24 H70 V48 H40 V70 H18 Z" />
                <path d="M80 22 H134 V60 H100 V44 H80 Z" />
                <path d="M22 84 H64 V118 H22 Z" />
                <path d="M76 76 H138 V108 H100 V120 H76 Z" />
              </g>
              <polygon points="8,140 160,120 190,150 30,176" fill="#0b1c24" stroke="#cfeaf2" strokeOpacity=".5" strokeWidth="1.2" />
            </g>
            <use href="#cubeShape" transform="translate(790 215)" />
            <use href="#cubeShape" transform="translate(170 300) scale(.9)" />
            <use href="#cubeShape" transform="translate(1000 300) scale(.7)" />
            <ellipse cx="826" cy="296" rx="60" ry="10" fill="#3fd6f5" opacity=".35" filter="url(#blur)" />
          </svg>
        </main>

        <RateDialog dlgRef={dlgRef} rate={rate} setRate={setRate} onSubmit={submitRate} />
      </div>
    </AppContext.Provider>
  );
}

export default CseSkillSync;