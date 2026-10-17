import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { summarize } from '../data/appData.js';
import { useApp } from '../context/AppContext.jsx';

export const Chevron = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="m5 2 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Arrow = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 7h10M8 3l4 4-4 4" />
  </svg>
);

export function Stars({ n }) {
  return (
    <span className="r-st" role="img" aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (i < n ? "★" : <i key={i}>★</i>))}
    </span>
  );
}

export function Chips({ items, onRemove }) {
  return (
    <ul className="chips">
      {items.map((s, i) => (
        <li className="chip" key={s + i}>
          {s}
          {onRemove && (
            <button type="button" aria-label={"Remove " + s} onClick={() => onRemove(i)}>
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export const avatarStyle = (photo) => ({ backgroundImage: photo ? `url("${photo}")` : undefined });

export function RatingLine({ name, role }) {
  const { instructorReviews } = useApp();
  if (role === "learner") return null;
  const sm = summarize(instructorReviews(name));
  return (
    <p className="meta">
      {sm.n ? (
        <>
          <span className="r-glow">★</span>
          {" " + sm.avg.toFixed(1) + " · " + sm.n + (sm.n === 1 ? " rating" : " ratings")}
        </>
      ) : (
        "No ratings yet"
      )}
    </p>
  );
}

export function PasswordField({ id, placeholder, autoComplete, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label className="sr-only" htmlFor={id}>{placeholder}</label>
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button className="eye" type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  );
}

export const Dropdown = forwardRef(function Dropdown(
  { id, value, onChange, options, invalid, describedBy, placeholder = "Select Role" },
  ref
) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  useImperativeHandle(ref, () => ({ focus: () => btnRef.current && btnRef.current.focus() }));

  const selIdx = options.findIndex((o) => o.value === value);
  const openList = () => {
    setIdx(selIdx > -1 ? selIdx : 0);
    setOpen(true);
  };
  const pick = (i) => {
    onChange(options[i].value);
    setOpen(false);
    btnRef.current.focus();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((idx + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((idx - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(idx);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };

  const listId = id + "-list";
  return (
    <div className={"field dd" + (open ? " open" : "") + (invalid ? " invalid" : "")} id={id} ref={rootRef}>
      <button
        ref={btnRef}
        className={"dd-btn" + (selIdx > -1 ? " has-value" : "")}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-describedby={describedBy}
        aria-activedescendant={open ? `${id}-opt-${idx}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="dd-label">{selIdx > -1 ? options[selIdx].label : placeholder}</span>
      </button>
      <svg className="dd-chev" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <ul className="dd-list" id={listId} role="listbox" aria-label="Role" hidden={!open}>
        {options.map((o, n) => (
          <li
            key={o.value}
            id={`${id}-opt-${n}`}
            role="option"
            aria-selected={n === selIdx}
            className={open && n === idx ? "active" : ""}
            onMouseEnter={() => setIdx(n)}
            onClick={() => pick(n)}
          >
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
});
