import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { IconFilm } from '../components/Icons';

export default function Films() {
  const [allFilms, setAllFilms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cats, setCats] = useState(['All']);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, 'films'), where('status', '==', 'visible'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAllFilms(data);
        setFiltered(data);
        const c = ['All', ...new Set(data.map(f => f.category).filter(Boolean))];
        setCats(c);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  function filter(cat) {
    setActive(cat);
    setFiltered(cat === 'All' ? allFilms : allFilms.filter(f => f.category === cat));
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Cinematography</p>
          <h1>Films &amp; Visual Works</h1>
          <p>Documentary storytelling and short films exploring truth, justice, and human experience.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div className="filter-tabs">
            {cats.map(c => (
              <button key={c} className={`filter-tab${active === c ? ' active' : ''}`} onClick={() => filter(c)}>{c}</button>
            ))}
          </div>
          <div className="works-grid">
            {loading ? [0,1,2,3].map(i => <div key={i} className="work-card skeleton" />) :
             filtered.length === 0 ? <p className="empty-msg" style={{ gridColumn: '1/-1' }}>No films published yet.</p> :
             filtered.map(item => (
               <div className="work-card" key={item.id}>
                 <div className="work-card-thumb">
                   {item.thumbnail ? <img src={item.thumbnail} alt={item.title} loading="lazy" /> : <div className="thumb-placeholder"><IconFilm /></div>}
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
        </div>
      </section>
    </>
  );
}
