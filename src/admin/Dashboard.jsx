import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function Dashboard() {
  const [counts, setCounts] = useState({ films: '—', law: '—', gallery: '—', messages: '—' });
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    async function load() {
      const cols = ['films', 'law', 'gallery', 'messages'];
      const res = {};
      for (const c of cols) {
        try { res[c] = (await getDocs(collection(db, c))).size; } catch { res[c] = 0; }
      }
      setCounts(res);
      try {
        const snap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(5)));
        setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
    }
    load();
  }, []);

  const cards = [
    { label: 'Films', key: 'films', sub: 'Published works' },
    { label: 'Legal Works', key: 'law', sub: 'Published items' },
    { label: 'Gallery', key: 'gallery', sub: 'Published photos' },
    { label: 'Messages', key: 'messages', sub: 'Total received' },
  ];

  return (
    <div className="admin-content">
      <div className="dash-cards">
        {cards.map(c => (
          <div className="dash-card" key={c.key}>
            <p className="card-label">{c.label}</p>
            <p className="card-value">{counts[c.key]}</p>
            <p className="card-sub">{c.sub}</p>
          </div>
        ))}
      </div>
      <div className="admin-panel">
        <div className="panel-header"><h3>Quick Actions</h3></div>
        <div className="panel-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['films', 'Add Film'], ['law', 'Add Legal Work'], ['gallery', 'Add Photo'], ['messages', 'View Messages']].map(([path, label]) => (
            <a key={path} href={`/admin/${path}`} className="btn-submit" style={{ textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
      </div>
      <div className="admin-panel">
        <div className="panel-header"><h3>Recent Messages</h3></div>
        <div className="panel-body">
          {msgs.length === 0 ? <p className="empty-state">No messages yet.</p> : msgs.map(m => (
            <div className="booking-card" key={m.id}>
              <div className="booking-name">{m.name || 'Unknown'} <span style={{ fontWeight: 300, color: 'var(--adm-muted)' }}>&lt;{m.email || ''}&gt;</span></div>
              <div className="booking-meta">{m.subject || ''} · {m.createdAt?.toDate?.().toLocaleDateString('en-GB') || '—'}</div>
              <div className="booking-msg">{m.message || ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
