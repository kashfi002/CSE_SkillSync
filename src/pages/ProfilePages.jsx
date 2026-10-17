import { useEffect, useRef, useState } from 'react';
import { ROLE_OPTIONS, ROLES, go } from '../data/appData.js';
import { useApp } from '../context/AppContext.jsx';
import { avatarStyle, Chips, Dropdown, RatingLine } from '../components/Shared.jsx';

export function ProfileView() {
  const { user } = useApp();
  return (
    <section className="card panel">
      <div className="p-head">
        <div className="avatar" aria-hidden="true" style={avatarStyle(user.photo)} />
        <div>
          <h1>{user.name}</h1>
          <p className="meta">{ROLES[user.role] + ", " + user.inst}</p>
          <RatingLine name={user.name} role={user.role} />
        </div>
      </div>
      <p className="lbl">Bio</p>
      <div className="bio-box">{user.bio}</div>
      <div className="skills">
        <div><p className="lbl">Skills to offer</p><Chips items={user.offer} /></div>
        <div><p className="lbl">Skills to learn</p><Chips items={user.learn} /></div>
      </div>
      <a className="cta" href="#edit">Edit Profile</a>
    </section>
  );
}

function SkillCol({ label, ariaLabel, items, onChange }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const btnRef = useRef(null);
  const refocusBtn = useRef(false);

  useEffect(() => {
    if (adding) inputRef.current && inputRef.current.focus();
    else if (refocusBtn.current) {
      btnRef.current && btnRef.current.focus();
      refocusBtn.current = false;
    }
  }, [adding]);

  const close = () => {
    refocusBtn.current = true;
    setAdding(false);
    setText("");
  };
  const add = () => {
    const v = text.trim();
    if (v && !items.some((s) => s.toLowerCase() === v.toLowerCase())) onChange([...items, v]);
    close();
  };

  return (
    <div className="skillcol">
      <p className="lbl">{label}</p>
      <Chips items={items} onRemove={(i) => onChange(items.filter((_, j) => j !== i))} />
      <button className="mini addbtn" type="button" ref={btnRef} hidden={adding} onClick={() => setAdding(true)}>
        +Add Skill
      </button>
      <span className="addrow" hidden={!adding}>
        <input
          className="skill-in"
          type="text"
          placeholder="Type a Skill"
          aria-label={ariaLabel}
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            } else if (e.key === "Escape") close();
          }}
        />
        <button className="mini addok" type="button" onClick={add}>Add</button>
      </span>
    </div>
  );
}

export function EditView() {
  const { user, setUser } = useApp();
  const [name, setName] = useState(user.name);
  const [inst, setInst] = useState(user.inst);
  const [role, setRole] = useState(user.role);
  const [bio, setBio] = useState(user.bio);
  const [photo, setPhoto] = useState(user.photo);
  const [offer, setOffer] = useState(user.offer.slice());
  const [learn, setLearn] = useState(user.learn.slice());
  const photoIn = useRef(null);

  const onPhoto = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result);
    r.readAsDataURL(f);
  };
  const submit = (e) => {
    e.preventDefault();
    setUser({ name: name.trim(), inst: inst.trim(), role, bio: bio.trim(), photo, offer, learn });
    go("#profile");
  };

  return (
    <section className="card panel">
      <form id="editForm" onSubmit={submit}>
        <h1 className="sr-only">Edit profile</h1>
        <div className="e-head">
          <div className="avatar" aria-hidden="true" style={avatarStyle(photo)} />
          <button className="linkbtn" type="button" onClick={() => photoIn.current && photoIn.current.click()}>Change profile photo</button>
          <input type="file" ref={photoIn} accept="image/*" hidden onChange={onPhoto} />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="e-name">Name</label>
          <input id="e-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="e-inst">Institution</label>
          <input id="e-inst" type="text" autoComplete="organization" value={inst} onChange={(e) => setInst(e.target.value)} required />
        </div>
        <div>
          <p className="lbl" id="e-role-lbl">Role</p>
          <Dropdown id="editRoleDd" value={role} options={ROLE_OPTIONS} onChange={setRole} describedBy="e-role-lbl" />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="e-bio">Bio</label>
          <textarea id="e-bio" rows={3} placeholder="Write a short bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="skills">
          <SkillCol label="Skills to offer" ariaLabel="Type a skill to offer" items={offer} onChange={setOffer} />
          <SkillCol label="Skills to learn" ariaLabel="Type a skill to learn" items={learn} onChange={setLearn} />
        </div>
        <div className="actions">
          <button className="cta primary" type="submit">Save</button>
          <a className="cta" href="#profile">Cancel</a>
        </div>
      </form>
    </section>
  );
}
