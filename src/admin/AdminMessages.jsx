import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';

export default function AdminMessages() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
        setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  async function markRead(id) {
    try {
      await updateDoc(doc(db, 'messages', id), { read: true });
      setMsgs(m => m.map(msg => msg.id === id ? { ...msg, read: true } : msg));
    } catch {}
  }

  return (
    <div className="admin-content">
      <div className="admin-panel">
        <div className="panel-header"><h3>Messages ({msgs.length})</h3></div>
        <div className="panel-body" style={{ padding: 0 }}>
          {loading ? <p className="empty-state">Loading…</p> :
           msgs.length === 0 ? <p className="empty-state">No messages yet.</p> :
           msgs.map(m => (
             <div key={m.id} className="booking-card" style={{ borderLeft: `2px solid ${m.read ? '#222' : '#c9a96e'}` }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.3rem' }}>
                 <div className="booking-name">{m.name || 'Unknown'} <span style={{ fontWeight: 300, color: 'var(--adm-muted)' }}>&lt;{m.email || ''}&gt;</span></div>
                 {!m.read && <button onClick={() => markRead(m.id)} style={{ font: 'inherit', fontSize: '.6rem', fontFamily: 'Space Grotesk,sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', background: 'none', border: '1px solid #333', color: '#6a6760', padding: '.2rem .5rem', cursor: 'pointer' }}>Mark Read</button>}
               </div>
               <div className="booking-meta">{m.subject} · {m.createdAt?.toDate?.().toLocaleDateString('en-GB') || '—'}</div>
               <div className="booking-msg">{m.message}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
