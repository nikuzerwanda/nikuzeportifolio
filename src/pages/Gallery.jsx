import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { IconImage } from '../components/Icons';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lb, setLb] = useState(null); // { src, alt }

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, 'gallery'), where('status', '==', 'visible')));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setLb(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Visual Stories</p>
          <h1>Gallery</h1>
          <p>Moments captured between the courtroom and the camera.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="gallery-grid">
            {loading ? [0,1,2].map(i => <div key={i} className="work-card skeleton" style={{ height: 250, breakInside: 'avoid', marginBottom: 3 }} />) :
             items.length === 0 ? <p className="empty-msg">No photos published yet.</p> :
             items.map(item => (
               <div key={item.id} className="gallery-item" onClick={() => setLb({ src: item.imageUrl, alt: item.caption || '' })}>
                 <img src={item.imageUrl} alt={item.caption || ''} loading="lazy" />
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div className={`lightbox${lb ? ' open' : ''}`} onClick={e => { if (e.target.classList.contains('lightbox')) setLb(null); }}>
        <span className="lb-close" onClick={() => setLb(null)}>&#x2715;</span>
        {lb && <img src={lb.src} alt={lb.alt} />}
      </div>
    </>
  );
}
