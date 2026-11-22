import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export default function MobileMenu({ links, active, scrollTo, setMenuOpen, reduced, toggleRef }) {
  const menuRef = useRef(null);
  const closing = useRef(false);
  const timer = useRef();
  const [entered, setEntered] = useState(false);

  function close(destination) {
    if (closing.current) return;
    closing.current = true;
    setEntered(false);
    timer.current = setTimeout(() => {
      setMenuOpen(false);
      if (destination) requestAnimationFrame(() => scrollTo(destination));
    }, reduced ? 0 : 530);
  }

  useEffect(() => {
    const previous = document.activeElement;
    const frame = requestAnimationFrame(() => setEntered(true));
    const focus = setTimeout(() => menuRef.current?.querySelector('a')?.focus(), 70);
    const onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusable = [...menuRef.current.querySelectorAll('a, button:not([disabled])')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault(); focusable.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault(); focusable[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(focus);
      clearTimeout(timer.current);
      document.removeEventListener('keydown', onKey);
      (previous || toggleRef.current)?.focus?.();
    };
  }, []); // Menu mounts once per opening; close() is local to this instance.

  function navigate(event, id) { event.preventDefault(); close(id); }
  const transition = reduced ? { duration: 0 } : { duration: 0.53, ease: [0.16, 1, 0.3, 1] };

  return createPortal(
    <motion.div ref={menuRef} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: entered ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
      transition={transition}>
      <div className="mobile-menu__top page-gutter">
        <span className="eyebrow">NAVIGATION / 2026</span>
        <button type="button" onClick={() => close()} className="mobile-menu__close" aria-label="Close menu"><span aria-hidden="true">×</span></button>
      </div>
      <nav aria-label="Mobile navigation" className="mobile-menu__links page-gutter">
        {links.map(([id, title], index) => (
          <a key={id} href={`#${id}`} onClick={event => navigate(event, id)} aria-current={active === id ? 'location' : undefined}>
            <span className="eyebrow">0{index + 1}</span><span>{title}</span><span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
      <div className="mobile-menu__bottom page-gutter"><span>LET'S BUILD SOMETHING.</span><a href="mailto:aniketbarai678@gmail.com">GET IN TOUCH ↗</a></div>
    </motion.div>, document.body,
  );
}
