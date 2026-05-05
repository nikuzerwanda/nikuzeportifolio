import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { IconScale, IconEdit, IconTrash } from '../components/Icons';

function toast(msg, type='success'){let t=document.querySelector('.adm-toast');if(!t){t=document.createElement('div');t.className='adm-toast';t.style.cssText='position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:.8rem 1.3rem;background:#161616;border:1px solid #222;font-family:Space Grotesk,sans-serif;font-size:.68rem;letter-spacing:.1em;color:#e8e5e0;transform:translateY(20px);opacity:0;transition:all .3s;';document.body.appendChild(t);}t.textContent=msg;t.style.borderColor=type==='error'?'#e05555':'#c9a96e';t.style.color=type==='error'?'#e05555':'#c9a96e';requestAnimationFrame(()=>requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateY(0)';}));setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(20px)';},3000);}

const EMPTY = { title: '', category: 'Human Rights', sourceLink: '', description: '', status: 'visible' };

export default function AdminLaw() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { const snap = await getDocs(query(collection(db,'law'), orderBy('createdAt','desc'))); setItems(snap.docs.map(d=>({id:d.id,...d.data()}))); } catch {}
  };
  useEffect(()=>{load();},[]);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function submit(e) {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { await updateDoc(doc(db,'law',editId),{...form,updatedAt:serverTimestamp()}); toast('Updated!'); }
      else { await addDoc(collection(db,'law'),{...form,createdAt:serverTimestamp()}); toast('Added!'); }
      setForm(EMPTY); setEditId(null); load();
    } catch { toast('Error.','error'); }
    setSaving(false);
  }

  async function del(id){if(!confirm('Delete?'))return;try{await deleteDoc(doc(db,'law',id));toast('Deleted.');load();}catch{toast('Error.','error');}}

  return (
    <div className="admin-content">
      <div className="admin-2col">
        <div className="admin-panel">
          <div className="panel-header"><h3>{editId?'Edit Legal Work':'Add Legal Work'}</h3></div>
          <div className="panel-body">
            <form onSubmit={submit}>
              <div className="form-group"><label>Title *</label><input placeholder="Work title" required value={form.title} onChange={set('title')}/></div>
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={set('category')}>
                  {['Human Rights','Constitutional','Criminal','Civil','Essay','Other'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Source Link</label><input type="url" placeholder="https://..." value={form.sourceLink} onChange={set('sourceLink')}/></div>
              <div className="form-group"><label>Description</label><textarea placeholder="Description…" value={form.description} onChange={set('description')}/></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={set('status')}><option value="visible">Visible</option><option value="hidden">Hidden</option></select></div>
              <div style={{display:'flex',gap:'.75rem'}}>
                <button type="submit" className="btn-submit" disabled={saving}>{saving?'SAVING...':editId?'UPDATE':'ADD'}</button>
                {editId&&<button type="button" className="btn-cancel" onClick={()=>{setEditId(null);setForm(EMPTY);}}>CANCEL</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="admin-panel">
          <div className="panel-header"><h3>All Legal Works</h3></div>
          <div className="panel-body" style={{padding:0}}>
            {items.length===0?<p className="empty-state">No items yet.</p>:items.map(item=>(
              <div className="item-card" key={item.id}>
                <div className="item-thumb"><IconScale /></div>
                <div className="item-info"><div className="item-title">{item.title}</div><div className="item-meta">{item.category} · <span className={`status-badge ${item.status}`}>{item.status}</span></div></div>
                <div className="item-actions">
                  <button className="btn-icon" onClick={()=>{setEditId(item.id);setForm({title:item.title||'',category:item.category||'Human Rights',sourceLink:item.sourceLink||'',description:item.description||'',status:item.status||'visible'});}}><IconEdit /></button>
                  <button className="btn-icon danger" onClick={()=>del(item.id)}><IconTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
