import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function showToast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = `toast ${type}`;
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => t.classList.remove('show'), 3500);
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'collaboration', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSending(true); setStatus(null);
    try {
      await addDoc(collection(db, 'messages'), { ...form, createdAt: serverTimestamp(), read: false });
      setStatus({ ok: true, text: '✓ Message sent! I will get back to you soon.' });
      setForm({ name: '', email: '', subject: 'collaboration', message: '' });
      showToast('Message sent!', 'success');
    } catch {
      setStatus({ ok: false, text: '✗ Failed to send. Please try again or email directly.' });
      showToast('Failed to send.', 'error');
    }
    setSending(false);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Reach Out</p>
          <h1>Get In Touch</h1>
          <p>For collaborations, inquiries, or just to say hello.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Let's Connect</h2>
              <p>Whether you have a film idea, a legal discussion, or a collaboration in mind — I'd love to hear from you.</p>
              <div className="contact-links">
                {[
                  { href: 'mailto:nikuzejos85@gmail.com', icon: '✉️', label: 'Email', value: 'nikuzejos85@gmail.com' },
                  { href: 'tel:+250795343820', icon: '📞', label: 'Phone', value: '+250 795 343 820' },
                  { href: 'https://wa.me/250786283889', icon: '💬', label: 'WhatsApp', value: '+250 786 283 889', ext: true },
                  { icon: '📍', label: 'Location', value: 'Kigali, Rwanda' },
                ].map((c, i) => (
                  c.href
                    ? <a key={i} href={c.href} target={c.ext ? '_blank' : undefined} rel={c.ext ? 'noopener noreferrer' : undefined} className="contact-link-item">
                        <div className="icon">{c.icon}</div>
                        <div><p className="label">{c.label}</p><p className="value">{c.value}</p></div>
                      </a>
                    : <div key={i} className="contact-link-item">
                        <div className="icon">{c.icon}</div>
                        <div><p className="label">{c.label}</p><p className="value">{c.value}</p></div>
                      </div>
                ))}
              </div>
            </div>

            <form className="contact-form" onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="cf-name">Full Name</label>
                <input id="cf-name" type="text" placeholder="Your name" required value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group">
                <label htmlFor="cf-email">Email Address</label>
                <input id="cf-email" type="email" placeholder="your@email.com" required value={form.email} onChange={set('email')} />
              </div>
              <div className="form-group">
                <label htmlFor="cf-subject">Subject</label>
                <select id="cf-subject" value={form.subject} onChange={set('subject')}>
                  <option value="collaboration">Film Collaboration</option>
                  <option value="legal">Legal Discussion</option>
                  <option value="inquiry">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cf-message">Message</label>
                <textarea id="cf-message" placeholder="Write your message..." required value={form.message} onChange={set('message')} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'SENDING...' : 'SEND MESSAGE'}</button>
              {status && <p className="cf-status" style={{ color: status.ok ? 'var(--accent)' : '#e05555', marginTop: '0.75rem', fontSize: '.85rem' }}>{status.text}</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
