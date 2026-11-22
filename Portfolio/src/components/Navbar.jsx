import { lazy, Suspense, useRef } from 'react';
import { createPortal } from 'react-dom';

const MobileMenu = lazy(() => import('./MobileMenu'));
const links = [
  ['projects', 'Work'],
  ['about', 'About'],
  ['skills', 'Expertise'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['contact', 'Contact'],
];

export default function Navbar({ active, scrollTo, theme, toggleTheme, menuOpen, setMenuOpen, reduced }) {
  const toggleRef = useRef(null);
  function navigate(event, id) { event.preventDefault(); scrollTo(id); }

  return (
    <>
      <a className="skip-link" href="#site-main">Skip to content</a>
      <header className="site-header">
        <div className="site-header__inner page-gutter">
          <a className="site-logo font-display" href="#hero" onClick={event => navigate(event, 'hero')} aria-label="Aniket Barai, back to top" data-cursor="TOP">
            ANIKET <span>BARAI<span className="accent-dot">.</span></span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map(([id, title]) => (
              <a key={id} href={`#${id}`} onClick={event => navigate(event, id)} aria-current={active === id ? 'location' : undefined} data-cursor="GO">
                {title}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'dark'} data-cursor="MODE">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.1 15.4A8.5 8.5 0 0 1 8.6 3.9 8.6 8.6 0 1 0 20.1 15.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
              )}
            </button>
            <button ref={toggleRef} type="button" className="menu-toggle" aria-label="Open menu" aria-expanded={menuOpen} aria-controls={menuOpen ? 'mobile-menu' : undefined} onClick={() => setMenuOpen(true)}>
              <span /><span />
            </button>
          </div>
        </div>
        <div className="nav-progress" aria-hidden="true" />
      </header>

      {menuOpen && (
        <Suspense fallback={createPortal(<div id="mobile-menu" className="mobile-menu mobile-menu--loading" role="status">OPENING NAVIGATION…</div>, document.body)}>
          <MobileMenu links={links} active={active} scrollTo={scrollTo} setMenuOpen={setMenuOpen} reduced={reduced} toggleRef={toggleRef} />
        </Suspense>
      )}
    </>
  );
}
