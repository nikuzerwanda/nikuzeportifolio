import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function toast(msg,type='success'){let t=document.querySelector('.adm-toast');if(!t){t=document.createElement('div');t.className='adm-toast';t.style.cssText='position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:.8rem 1.3rem;background:#161616;border:1px solid #222;font-family:Space Grotesk,sans-serif;font-size:.68rem;letter-spacing:.1em;color:#e8e5e0;transform:translateY(20px);opacity:0;transition:all .3s;';document.body.appendChild(t);}t.textContent=msg;t.style.borderColor=type==='error'?'#e05555':'#c9a96e';t.style.color=type==='error'?'#e05555':'#c9a96e';requestAnimationFrame(()=>requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateY(0)';}));setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(20px)';},3000);}

const FIELDS = [
  { key: 'heroTitle', label: 'Hero Title (words space-separated)' },
  { key: 'heroSubtitle', label: 'Hero Subtitle / Description', textarea: true },
  { key: 'heroQuote', label: 'Featured Quote', textarea: true },
  { key: 'footerAbout', label: 'Footer About Text' },
  { key: 'email', label: 'Contact Email' },
  { key: 'phone', label: 'Contact Phone' },
  { key: 'whatsapp', label: 'WhatsApp URL' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'tiktok', label: 'TikTok URL' },
  { key: 'quickLinks', label: 'Quick Links (Format: Label,URL - one per line)', textarea: true },
];

export default function AdminSettings() {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'site')).then(snap => { if (snap.exists()) setForm(snap.data()); }).catch(() => {});
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault(); setSaving(true);
    try { await setDoc(doc(db, 'settings', 'site'), form, { merge: true }); toast('Settings saved!'); }
    catch { toast('Error saving.', 'error'); }
    setSaving(false);
  }

  return (
    <div className="admin-content">
      <div className="admin-panel">
        <div className="panel-header"><h3>Site Settings</h3></div>
        <div className="panel-body">
          <form onSubmit={submit}>
            {FIELDS.map(f => (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                {f.textarea
                  ? <textarea value={form[f.key] || ''} onChange={set(f.key)} />
                  : <input value={form[f.key] || ''} onChange={set(f.key)} />
                }
              </div>
            ))}
            <button type="submit" className="btn-submit" disabled={saving}>{saving ? 'SAVING...' : 'SAVE SETTINGS'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
