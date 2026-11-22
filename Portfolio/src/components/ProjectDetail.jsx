import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import ProjectImage from './ProjectImage';
import { projects } from '../data/projects';

// Loaded on demand. The page is inert while this dialog animates open/closed.
export default function ProjectDetail({ project, onClose, reduced }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const timer = useRef();
  const closing = useRef(false);
  const [open, setOpen] = useState(false);

  function requestClose() {
    if (closing.current) return;
    closing.current = true;
    setOpen(false);
    timer.current = setTimeout(onClose, reduced ? 0 : 680);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    closeRef.current?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); requestClose(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault(); focusable.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault(); focusable[0].focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer.current);
      document.removeEventListener('keydown', handleKey);
    };
  }, []); // A case study remains mounted until its close transition finishes.

  return createPortal(
    <motion.div ref={dialogRef} className="detail-view" role="dialog" aria-modal="true" aria-labelledby="detail-title" tabIndex={-1}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: open ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)' }}
      transition={reduced ? { duration: 0 } : { duration: 0.68, ease: [0.76, 0, 0.24, 1] }}>
      <div className="detail-view__top page-gutter">
        <span className="eyebrow">PROJECT / 0{projects.indexOf(project) + 1}</span>
        <button ref={closeRef} type="button" onClick={requestClose} className="detail-view__close" aria-label={`Close ${project.name} details`}>CLOSE <span aria-hidden="true">×</span></button>
      </div>
      <div className="detail-view__body content-width">
        <div className="detail-view__intro">
          <span className="eyebrow">{project.category} <span className="accent-dot">●</span> {project.status}</span>
          <h2 id="detail-title" className="font-display">{project.name}<span className="accent-dot">.</span></h2>
          <p className="font-serif">{project.descriptor}</p>
        </div>
        <div className="detail-view__image"><ProjectImage project={project} eager /></div>
        <div className="detail-view__text">
          <div><span className="eyebrow">THE STORY / IN SHORT</span><p>{project.detail}</p></div>
          <div><span className="eyebrow">WHAT I BUILT</span><ul>{project.points.map(point => <li key={point}>{point}</li>)}</ul></div>
        </div>
        <div className="detail-view__bottom">
          <div className="detail-view__tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
          <div className="detail-view__links">
            {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">VISIT LIVE SITE <span aria-hidden="true">↗</span></a>}
            {project.source && <a href={project.source} target="_blank" rel="noopener noreferrer">VIEW SOURCE <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
      </div>
    </motion.div>, document.body,
  );
}
