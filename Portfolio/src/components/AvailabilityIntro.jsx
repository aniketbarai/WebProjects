import { useCallback, useEffect, useRef, useState } from 'react';

const EXIT_DURATION = 700;
const AUTO_CLOSE_DELAY = 5_000;

// The site is visible but inert behind the frosted overlay until dismissal.
export default function AvailabilityIntro({ onClose, onBeginClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const exitTimer = useRef(null);
  const autoCloseTimer = useRef(null);
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);

  const dismiss = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    clearTimeout(autoCloseTimer.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    setClosing(true);
    onBeginClose();
    // Keep focus on the closing control until the new page is ready to receive it.
    closeRef.current?.focus({ preventScroll: true });
    exitTimer.current = window.setTimeout(onClose, EXIT_DURATION);
  }, [onClose, onBeginClose]);

  useEffect(() => {
    autoCloseTimer.current = window.setTimeout(dismiss, AUTO_CLOSE_DELAY);
    return () => clearTimeout(autoCloseTimer.current);
  }, [dismiss]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const handleKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismiss();
        return;
      }
      if (closingRef.current && event.key === 'Tab') {
        event.preventDefault();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
      if (!focusable.length) return;
      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        focusable[0].focus();
      } else if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault();
        focusable[0].focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer.current);
      document.removeEventListener('keydown', handleKey);
    };
  }, [dismiss]);

  return (
    <div className={`intro-screen${closing ? ' intro-screen--closing' : ''}`}>
      <section ref={dialogRef} className={`intro-card${closing ? ' intro-card--closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="intro-title" aria-describedby="intro-copy intro-timing">
        <header className="intro-card__top">
          <span className="intro-card__brand font-display">ANIKET BARAI<span className="accent-dot">.</span></span>
          <button ref={closeRef} className={`intro-card__close${closing ? ' intro-card__close--closing' : ''}`} type="button" onClick={dismiss} aria-label="Close introduction and view portfolio"><span>CLOSE</span></button>
        </header>
        <div className="intro-card__body">
          <p id="intro-timing" className="intro-card__eyebrow eyebrow"><span className="availability__dot" aria-hidden="true" /> AUTO-CLOSES IN 5S</p>
          <h1 id="intro-title" className="intro-card__title font-display">Open to <em className="font-serif">internships</em><br />{' '}&amp; freelance projects<span className="accent-dot">.</span></h1>
          <p id="intro-copy" className="intro-card__copy">Thank you for visiting my portfolio. If you have an opportunity or a project in mind, I would be glad to connect.</p>
          <dl className="intro-card__details">
            <div><dt>NAME</dt><dd>Aniket Barai</dd></div>
            <div><dt>PHONE</dt><dd><a href="tel:+917304414905">+91 73044 14905</a></dd></div>
            <div><dt>EMAIL</dt><dd><a href="mailto:aniketbarai678@gmail.com">aniketbarai678@gmail.com</a></dd></div>
            <div><dt>LINKEDIN</dt><dd><a href="https://www.linkedin.com/in/aniketbarai/" target="_blank" rel="noopener noreferrer" aria-label="Aniket Barai on LinkedIn, opens in a new tab">aniketbarai <span aria-hidden="true">↗</span></a></dd></div>
          </dl>
        </div>
      </section>
    </div>
  );
}
