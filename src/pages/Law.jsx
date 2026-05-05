import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Law() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, 'law'), where('status', '==', 'visible')));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Justice &amp; Advocacy</p>
          <h1>Legal Work</h1>
          <p>Where justice is written, argued, and sometimes broken.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div className="law-list">
            {loading ? [0,1].map(i => <div key={i} className="work-card skeleton" style={{ height: 150 }} />) :
             items.length === 0 ? <p className="empty-msg">No legal works published yet.</p> :
             items.map(item => (
               <div
                 key={item.id}
                 className="law-item"
                 onClick={() => item.sourceLink && window.open(item.sourceLink, '_blank')}
               >
                 <span className="law-item-tag">{item.category || 'Law'}</span>
                 <h3>{item.title}</h3>
                 <p>{item.description || ''}</p>
                 {item.sourceLink && <span className="law-link">Read More →</span>}
               </div>
             ))}
          </div>
        </div>
      </section>
    </>
  );
}
