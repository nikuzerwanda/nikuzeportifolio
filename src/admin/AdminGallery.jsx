import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

function toast(msg,type='success'){let t=document.querySelector('.adm-toast');if(!t){t=document.createElement('div');t.className='adm-toast';t.style.cssText='position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:.8rem 1.3rem;background:#161616;border:1px solid #222;font-family:Space Grotesk,sans-serif;font-size:.68rem;letter-spacing:.1em;color:#e8e5e0;transform:translateY(20px);opacity:0;transition:all .3s;';document.body.appendChild(t);}t.textContent=msg;t.style.borderColor=type==='error'?'#e05555':'#c9a96e';t.style.color=type==='error'?'#e05555':'#c9a96e';requestAnimationFrame(()=>requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateY(0)';}));setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(20px)';},3000);}

const EMPTY = { imageUrl: '', caption: '', status: 'visible' };

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { const snap = await getDocs(query(collection(db,'gallery'),orderBy('createdAt','desc'))); setItems(snap.docs.map(d=>({id:d.id,...d.data()}))); } catch {}
  };
  useEffect(()=>{load();},[]);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  async function submit(e) {
    e.preventDefault(); setSaving(true);
    try {
      if(editId){await updateDoc(doc(db,'gallery',editId),{...form,updatedAt:serverTimestamp()});toast('Updated!');}
      else{await addDoc(collection(db,'gallery'),{...form,createdAt:serverTimestamp()});toast('Photo added!');}
      setForm(EMPTY); setEditId(null); load();
    } catch{toast('Error.','error');}
    setSaving(false);
  }

  async function del(id){if(!confirm('Delete?'))return;try{await deleteDoc(doc(db,'gallery',id));toast('Deleted.');load();}catch{toast('Error.','error');}}

  return (
    <div className="admin-content">
      <div className="admin-2col">
        <div className="admin-panel">
          <div className="panel-header"><h3>{editId?'Edit Photo':'Add Photo'}</h3></div>
          <div className="panel-body">
            <form onSubmit={submit}>
              <div className="form-group"><label>Image URL *</label><input type="url" placeholder="https://..." required value={form.imageUrl} onChange={set('imageUrl')}/></div>
              <div className="form-group"><label>Caption</label><input placeholder="Optional caption" value={form.caption} onChange={set('caption')}/></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={set('status')}><option value="visible">Visible</option><option value="hidden">Hidden</option></select></div>
              {form.imageUrl && <div className="form-group"><img src={form.imageUrl} alt="preview" style={{width:'100%',maxHeight:200,objectFit:'cover',border:'1px solid #222'}}/></div>}
              <div style={{display:'flex',gap:'.75rem'}}>
                <button type="submit" className="btn-submit" disabled={saving}>{saving?'SAVING...':editId?'UPDATE':'ADD PHOTO'}</button>
                {editId&&<button type="button" className="btn-cancel" onClick={()=>{setEditId(null);setForm(EMPTY);}}>CANCEL</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="admin-panel">
          <div className="panel-header"><h3>All Photos</h3></div>
          <div className="panel-body" style={{padding:0}}>
            {items.length===0?<p className="empty-state">No photos yet.</p>:items.map(item=>(
              <div className="item-card" key={item.id}>
                <div className="item-thumb">{item.imageUrl?<img src={item.imageUrl} alt="" style={{width:52,height:52,objectFit:'cover'}}/>:'🖼️'}</div>
                <div className="item-info"><div className="item-title">{item.caption||'(no caption)'}</div><div className="item-meta"><span className={`status-badge ${item.status}`}>{item.status}</span></div></div>
                <div className="item-actions">
                  <button className="btn-icon" onClick={()=>{setEditId(item.id);setForm({imageUrl:item.imageUrl||'',caption:item.caption||'',status:item.status||'visible'});}}>✏️</button>
                  <button className="btn-icon danger" onClick={()=>del(item.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
