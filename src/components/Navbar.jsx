import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/films', label: 'FILMS' },
    { to: '/law', label: 'LAW' },
    { to: '/gallery', label: 'GALLERY' },
    { to: '/about', label: 'ABOUT' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-first">NIKUZE</span>
          <span className="logo-last"> JOSELYNE</span>
        </Link>
        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={pathname === l.to ? 'active' : ''}
              >{l.label}</Link>
            </li>
          ))}
          <li>
            <Link to="/contact" className="nav-cta">CONTACT</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
