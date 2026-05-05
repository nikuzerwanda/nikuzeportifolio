import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore';

function useInView(ref) {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

export default function Home() {
  const [settings, setSettings] = useState({});
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);
  useInView(pageRef);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'site'));
        if (snap.exists()) setSettings(snap.data());
      } catch {}
      try {
        const q = query(collection(db, 'films'), where('status', '==', 'visible'), limit(6));
        const snap = await getDocs(q);
        setFilms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const heroLines = settings.heroTitle ? settings.heroTitle.split(' ') : ['FRAMING', 'TRUTH', 'THROUGH FILM'];

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-gradient" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Rwandan · Law Student · Filmmaker</p>
          <h1 className="hero-title">
            <span className="title-line">{heroLines[0] || 'FRAMING'}</span>
            <span className="title-line">{heroLines[1] || 'TRUTH'}</span>
            <span className="title-line">{heroLines.slice(2).join(' ') || 'THROUGH FILM'}</span>
          </h1>
          <p className="hero-subtitle">NIKUZE JOSELYNE</p>
          <div className="hero-divider" />
          <p className="hero-desc">{settings.heroSubtitle || 'I live between the courtroom and the camera — framing truth through film while learning how justice is written, argued, and sometimes broken.'}</p>
          <div className="hero-actions">
            <Link to="/films" className="btn btn-primary">EXPLORE MY WORK</Link>
            <Link to="/contact" className="btn btn-ghost">GET IN TOUCH</Link>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Recent Works */}
      <section className="section recent-works">
        <div className="container">
          <div className="section-header fade-up">
            <p className="section-eyebrow">Portfolio</p>
            <h2 className="section-title">Recent Works</h2>
            <p className="section-desc">A selection of films, documentaries and visual stories.</p>
          </div>
          <div className="works-grid">
            {loading ? (
              [0,1,2].map(i => <div key={i} className="work-card skeleton" />)
            ) : films.length === 0 ? (
              <p className="empty-msg">No works published yet.</p>
            ) : films.map(item => (
              <div className="work-card" key={item.id}>
                <div className="work-card-thumb">
                  {item.thumbnail
                    ? <img src={item.thumbnail} alt={item.title} loading="lazy" />
                    : <div className="thumb-placeholder">🎬</div>
                  }
                  <div className="work-card-overlay">
                    <a href={item.sourceLink || '#'} target="_blank" rel="noopener noreferrer" className="btn-view">View Work</a>
                  </div>
                </div>
                <div className="work-card-info">
                  <span className="work-tag">{item.category || 'Film'}</span>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer fade-up">
            <Link to="/films" className="btn btn-outline">VIEW ALL WORKS</Link>
          </div>
        </div>
      </section>

      {/* Dual Identity */}
      <section className="section dual-identity" style={{ background: 'var(--black-soft)', borderTop: '1px solid var(--black-border)' }}>
        <div className="container">
          <div className="dual-grid fade-up">
            <div className="dual-card">
              <div className="dual-icon">⚖️</div>
              <h3>The Law Student</h3>
              <p>Studying how justice is written, argued, and sometimes broken. Exploring law, society, and human rights in Rwanda and beyond.</p>
              <Link to="/law" className="btn-link">Explore Legal Work →</Link>
            </div>
            <div className="dual-divider" />
            <div className="dual-card">
              <div className="dual-icon">🎬</div>
              <h3>The Filmmaker</h3>
              <p>Framing truth through the lens. Documentary storytelling, short films, and visual narratives that speak to the human experience.</p>
              <Link to="/films" className="btn-link">View Films →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section quote-section">
        <div className="container">
          <blockquote className="featured-quote fade-up">
            <span className="quote-mark">"</span>
            <p>{settings.heroQuote || 'I live between the courtroom and the camera — framing truth through film while learning how justice is written, argued, and sometimes broken.'}</p>
            <cite>— Nikuze Joselyne</cite>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
