import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { IconUser, IconEye, IconTarget } from '../components/Icons';

export default function About() {
  const [d, setD] = useState({});

  useEffect(() => {
    getDoc(doc(db, 'settings', 'about')).then(snap => {
      if (snap.exists()) setD(snap.data());
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Who I Am</p>
          <h1>About Me</h1>
          <p>{d.tagline || 'Law student & filmmaker from Kigali, Rwanda.'}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrap">
              {d.photoUrl
                ? <img src={d.photoUrl} alt={d.name || 'Nikuze Joselyne'} />
                : <div className="about-image-placeholder"><IconUser /></div>
              }
            </div>
            <div className="about-text">
              <h2>{d.name || 'NIKUZE JOSELYNE'}</h2>
              <p className="subtitle">{d.subtitle || 'Law Student · Filmmaker · Rwanda'}</p>
              <p>{d.bio || 'I live between the courtroom and the camera — framing truth through film while learning how justice is written, argued, and sometimes broken.'}</p>
              {d.bio2 && <p>{d.bio2}</p>}
              <div className="info-grid">
                <div className="info-item"><label>Citizenship</label><span>{d.citizenship || 'Rwandan'}</span></div>
                <div className="info-item"><label>Location</label><span>{d.location || 'Kigali, Rwanda'}</span></div>
                <div className="info-item"><label>Email</label><span><a href={`mailto:${d.email || 'nikuzejos85@gmail.com'}`} style={{ color: 'inherit' }}>{d.email || 'nikuzejos85@gmail.com'}</a></span></div>
                <div className="info-item"><label>Phone</label><span>{d.phone || '+250 795 343 820'}</span></div>
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary">GET IN TOUCH</Link>
                <Link to="/films" className="btn btn-ghost">VIEW MY WORK</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--black-soft)', borderTop: '1px solid var(--black-border)' }}>
        <div className="container">
          <div className="dual-grid">
            <div className="dual-card">
              <div className="dual-icon"><IconEye /></div>
              <h3>{d.visionTitle || 'Vision'}</h3>
              <p>{d.visionText || 'To use the power of storytelling — both legal and cinematic — to advocate for justice, amplify silenced voices, and document the truth of our time.'}</p>
            </div>
            <div className="dual-divider" />
            <div className="dual-card">
              <div className="dual-icon"><IconTarget /></div>
              <h3>{d.missionTitle || 'Mission'}</h3>
              <p>{d.missionText || 'To create films and legal frameworks that hold power accountable, give communities a voice, and bridge the gap between art and justice in Rwanda and Africa.'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
