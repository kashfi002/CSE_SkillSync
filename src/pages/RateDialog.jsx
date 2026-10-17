import { useEffect, useRef } from 'react';
import { WORDS } from '../data/appData.js';

const STAR_PATH = "M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8z";

export function RateDialog({ dlgRef, rate, setRate, onSubmit }) {
    const closeBtnRef = useRef(null);
  const shown = rate.hover || rate.stars;

  useEffect(() => {
    if (rate.step === 2 && closeBtnRef.current) closeBtnRef.current.focus();
  }, [rate.step]);

  const close = () => dlgRef.current && dlgRef.current.close();

  return (
    <dialog
      className="modal"
      ref={dlgRef}
      aria-labelledby="rateTitle"
      onClick={(e) => {
        if (e.target === dlgRef.current) close();
      }}
    >
      {rate.step === 1 ? (
        <div>
          <h2 id="rateTitle">Rate the instructor</h2>
          <p className="meta">{rate.sub}</p>
          <form noValidate onSubmit={onSubmit}>
            <fieldset className="stars" aria-describedby="rateErr">
              <legend className="sr-only">Your rating out of 5</legend>
              {[1, 2, 3, 4, 5].map((v) => (
                <label
                  key={v}
                  className={v <= shown ? "on" : ""}
                  onMouseEnter={() => setRate((r) => ({ ...r, hover: v }))}
                  onMouseLeave={() => setRate((r) => ({ ...r, hover: 0 }))}
                >
                  <input
                    type="radio"
                    name="stars"
                    value={v}
                    checked={rate.stars === v}
                    onChange={() => setRate((r) => ({ ...r, stars: v, err: false }))}
                  />
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={STAR_PATH} /></svg>
                  <span className="sr-only">{v} star{v > 1 ? "s" : ""}</span>
                </label>
              ))}
            </fieldset>
            <p className="star-word" aria-live="polite">{shown ? WORDS[shown] : "Tap a star to rate"}</p>
            <label className="lbl" htmlFor="rateNote">Feedback (optional)</label>
            <textarea
              id="rateNote"
              rows={3}
              placeholder="How was the class? What could be better?"
              value={rate.note}
              onChange={(e) => setRate((r) => ({ ...r, note: e.target.value }))}
            />
            {rate.err && <p className="err" id="rateErr" role="alert">Choose a rating from 1 to 5 stars.</p>}
            <div className="actions">
              <button className="cta primary" type="submit">Submit</button>
              <button className="cta" type="button" onClick={close}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <span className="done-ic" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 8.5 3.2 3L13 4.5" />
            </svg>
          </span>
          <h2>Thanks for your feedback</h2>
          <p className="meta">{rate.done}</p>
          <div className="actions">
            <button className="cta primary" type="button" ref={closeBtnRef} onClick={close}>Done</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
