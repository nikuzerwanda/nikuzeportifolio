import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function toast(msg,type='success'){let t=document.querySelector('.adm-toast');if(!t){t=document.createElement('div');t.className='adm-toast';t.style.cssText='position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:.8rem 1.3rem;background:#161616;border:1px solid #222;font-family:Space Grotesk,sans-serif;font-size:.68rem;letter-spacing:.1em;color:#e8e5e0;transform:translateY(20px);opacity:0;transition:all .3s;';document.body.appendChild(t);}t.textContent=msg;t.style.borderColor=type==='error'?'#e05555':'#c9a96e';t.style.color=type==='error'?'#e05555':'#c9a96e';requestAnimationFrame(()=>requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateY(0)';}));setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(20px)';},3000);}

const FIELDS = [
  { key: 'name', label: 'Full Name' },
  { key: 'tagline', label: 'Page Tagline' },
  { key: 'subtitle', label: 'Subtitle (under name)' },
  { key: 'bio', label: 'Biography (paragraph 1)', textarea: true },
  { key: 'bio2', label: 'Biography (paragraph 2)', textarea: true },
  { key: 'citizenship', label: 'Citizenship' },
  { key: 'location', label: 'Location' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'photoUrl', label: 'Photo URL' },
  { key: 'visionTitle', label: 'Vision Title' },
  { key: 'visionText', label: 'Vision Text', textarea: true },
  { key: 'missionTitle', label: 'Mission Title' },
  { key: 'missionText', label: 'Mission Text', textarea: true },
];

export default function AdminAbout() {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'about')).then(snap => { if (snap.exists()) setForm(snap.data()); }).catch(() => {});
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault(); setSaving(true);
    try { await setDoc(doc(db, 'settings', 'about'), form, { merge: true }); toast('About page saved!'); }
    catch { toast('Error saving.', 'error'); }
    setSaving(false);
  }

  return (
    <div className="admin-content">
      <div className="admin-panel">
        <div className="panel-header"><h3>About Page Settings</h3></div>
        <div className="panel-body">
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
              {FIELDS.map(f => (
                <div key={f.key} className="form-group" style={f.textarea ? { gridColumn: '1/-1' } : {}}>
                  <label>{f.label}</label>
                  {f.textarea
                    ? <textarea value={form[f.key] || ''} onChange={set(f.key)} style={{ minHeight: 80 }} />
                    : <input value={form[f.key] || ''} onChange={set(f.key)} />
                  }
                </div>
              ))}
            </div>
            {form.photoUrl && <img src={form.photoUrl} alt="preview" style={{ width: 120, height: 160, objectFit: 'cover', border: '1px solid #222', marginBottom: '1rem' }} />}
            <button type="submit" className="btn-submit" disabled={saving}>{saving ? 'SAVING...' : 'SAVE CHANGES'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
