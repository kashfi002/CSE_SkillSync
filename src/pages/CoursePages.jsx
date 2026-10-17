import { useEffect, useRef, useState } from 'react';
import { FILE_HINT, go } from '../data/appData.js';
import { useApp } from '../context/AppContext.jsx';

export function FindView() {
  const { courses, setCourses, summarizeInstructor } = useApp();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = courses.filter((c) => (c.title + " " + c.by + " " + c.desc).toLowerCase().indexOf(query) > -1);
  const toggle = (id) => setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c)));

  return (
    <section className="card panel pg">
      <a className="back" href="#welcome">← Back</a>
      <h1>Find a course</h1>
      <p className="meta">Search a course and tap Interested to join a team</p>
      <div className="search">
        <label className="sr-only" htmlFor="courseQ">Search course</label>
        <input id="courseQ" type="text" placeholder="Search course, e.g. OOP" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="7" cy="7" r="4" />
          <path d="m10 10 3 3" />
        </svg>
      </div>
      <div className="course-grid">
        {shown.map((c) => {
          const rs = summarizeInstructor(c.title);
          return (
            <article className="course" key={c.id}>
              <div className="c-by">
                <span className="c-av" aria-hidden="true" />
                <span>{c.by}</span>
                <span className={"c-rate" + (rs.n ? "" : " none")}>
                  {rs.n ? (
                    <>
                      <span className="r-glow">★</span>
                      {" " + rs.avg.toFixed(1) + " (" + rs.n + ")"}
                    </>
                  ) : (
                    "No ratings yet"
                  )}
                </span>
              </div>
              <h2>{c.title}</h2>
              <p>{c.desc}</p>
              <div className="c-foot">
                <button className={"mini fill" + (c.joined ? " on" : "")} type="button" aria-pressed={c.joined} onClick={() => toggle(c.id)}>
                  {c.joined ? "Interested ✓" : "Interested"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {shown.length === 0 && <p className="meta">No course found. Try another word.</p>}
    </section>
  );
}

export function OfferView() {
  const { user, setCourses, setTeaching } = useApp();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [ach, setAch] = useState("");
  const [file, setFile] = useState(null);
  const [fileErr, setFileErr] = useState(false);
  const fileRef = useRef(null);
  const uBtnRef = useRef(null);

  // revoke the preview URL whenever it is replaced or the view unmounts
  useEffect(() => {
    if (!file) return undefined;
    return () => URL.revokeObjectURL(file.url);
  }, [file]);

  const clearFile = () => {
    setFile(null);
    setFileErr(false);
    if (fileRef.current) fileRef.current.value = "";
  };
  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const isImg = /^image\//.test(f.type);
    const isPdf = f.type === "application/pdf";
    if (!isImg && !isPdf) {
      clearFile();
      setFileErr(true);
      return;
    }
    setFileErr(false);
    setFile({ url: URL.createObjectURL(f), name: f.name, isImg });
  };
  const submit = (e) => {
    e.preventDefault();
    const t = title.trim();
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setCourses((cs) => [{ id: "c-" + Date.now(), by: user.name, title: t, desc: details.trim(), joined: false }, ...cs]);
    setTeaching((ts) => [{ title: t, learners: 0, link: "meet.example.com/" + slug }, ...ts]);
    go("#find");
  };

  return (
    <section className="card panel pg">
      <a className="back" href="#welcome">← Back</a>
      <h1>Offer Instruction</h1>
      <p className="meta">Create a post about a course you can teach</p>
      <form id="offerForm" style={{ marginTop: 24 }} onSubmit={submit}>
        <div className="field">
          <label className="lbl" htmlFor="o-title">Course Title</label>
          <input id="o-title" type="text" placeholder="Course title, e.g. OOP" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="o-details">Course details</label>
          <textarea id="o-details" rows={3} placeholder="What will you teach?" value={details} onChange={(e) => setDetails(e.target.value)} required />
        </div>
        <div>
          <span className="lbl" id="o-file-lbl">Image or Certificate</span>
          <div className="upload">
            <input type="file" ref={fileRef} accept="image/*,application/pdf" hidden onChange={onFile} />
            {file && (
              <div className="u-preview">
                {file.isImg ? <img src={file.url} alt="Preview of the chosen image" /> : <span className="u-pdf">PDF</span>}
              </div>
            )}
            <button
              className="u-btn"
              ref={uBtnRef}
              type="button"
              aria-label={file ? "Change file" : FILE_HINT}
              onClick={() => fileRef.current && fileRef.current.click()}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 11V3M5 6l3-3 3 3M3 13h10" />
              </svg>
            </button>
            <span className="u-txt">{file ? file.name : FILE_HINT}</span>
            {file && (
              <button
                className="linkbtn u-rm"
                type="button"
                onClick={() => {
                  clearFile();
                  uBtnRef.current && uBtnRef.current.focus();
                }}
              >
                Remove
              </button>
            )}
          </div>
          {fileErr && <p className="err" role="alert">Choose an image (PNG, JPG) or a PDF file.</p>}
        </div>
        <div className="field">
          <label className="lbl" htmlFor="o-ach">Achievement</label>
          <input id="o-ach" type="text" placeholder="e.g. winner, national programming contest" value={ach} onChange={(e) => setAch(e.target.value)} />
        </div>
        <div className="actions">
          <button className="cta primary" type="submit">Publish</button>
          <a className="cta" href="#welcome">Cancel</a>
        </div>
      </form>
    </section>
  );
}
