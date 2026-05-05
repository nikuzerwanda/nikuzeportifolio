// ============================================
// admin.js - Shared admin utilities
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const cfg = {
  apiKey:"AIzaSyBbudjWIFVdkFbvewv6FNEkfCTJIOhyTA8",
  authDomain:"nikuzeportfolio.firebaseapp.com",
  projectId:"nikuzeportfolio",
  storageBucket:"nikuzeportfolio.firebasestorage.app",
  messagingSenderId:"158373976578",
  appId:"1:158373976578:web:080a58461a2bbcb616651b"
};

export const app = initializeApp(cfg);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Guard - redirect to login if not authenticated
export function requireAuth(callback) {
  onAuthStateChanged(auth, user => {
    if (!user) { window.location.href = 'index.html'; return; }
    const userTag = document.getElementById('user-tag');
    if (userTag) userTag.textContent = user.email;
    if (callback) callback(user);
  });
}

// Sign out
export function setupSignOut() {
  const btn = document.getElementById('btn-signout');
  if (btn) btn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  });
}

// Highlight active nav link
export function highlightNav() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page) a.classList.add('active');
  });
}

// Toast
export function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// Shared sidebar HTML
export function renderSidebar() {
  return `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="brand-name">NIKUZE JOSELYNE</div>
        <div class="brand-sub">Admin Portal</div>
      </div>
      <nav class="sidebar-nav">
        <a href="dashboard.html">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </a>
        <a href="films.html">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
          Films
        </a>
        <a href="law.html">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6l9-4 9 4v6c0 5.25-4 9.5-9 11-5-1.5-9-5.75-9-11V6z"/></svg>
          Law
        </a>
        <a href="gallery.html">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          Gallery
        </a>
        <a href="about.html">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          About
        </a>
        <a href="messages.html">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Messages
        </a>
        <a href="settings.html">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          Settings
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="btn-signout" id="btn-signout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>`;
}
