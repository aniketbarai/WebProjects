import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { projects } from '../data/projects';
import ProjectImage from './ProjectImage';

export default function ProjectIndex({ onSelect, enabled }) {
  const [hovered, setHovered] = useState(null);
  const previewPosition = useRef(null);

  function move(event) {
    const x = Math.max(16, Math.min(event.clientX + 26, window.innerWidth - 300));
    const y = Math.max(16, Math.min(event.clientY - 112, window.innerHeight - 235));
    // Position the fixed wrapper directly: one compositor transform per pointer
    // event, without a React re-render or layout measurement.
    if (previewPosition.current) previewPosition.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  return (
    <div className="project-index content-width">
      <div className="project-index__heading eyebrow"><span>THE COMPLETE INDEX</span><span>SELECT A PROJECT ↘</span></div>
      <ol>
        {projects.map((project, index) => (
          <li key={project.slug}>
            <button type="button" onClick={event => onSelect(project, event.currentTarget)} onPointerEnter={event => { if (enabled) { move(event); setHovered(project); } }} onPointerMove={event => { if (enabled) move(event); }} onPointerLeave={() => setHovered(null)} data-cursor="VIEW">
              <span className="project-index__number eyebrow">0{index + 1}</span>
              <span className="project-index__name font-display">{project.name}</span>
              <span className="project-index__category eyebrow">{project.category}</span>
              <span className="project-index__arrow" aria-hidden="true">↗</span>
            </button>
          </li>
        ))}
      </ol>
      {enabled && createPortal(
        <div ref={previewPosition} className="index-preview-anchor" aria-hidden="true">
          {hovered && (
            <div key={hovered.slug} className="index-preview">
              <ProjectImage project={hovered} />
              <span className="index-preview__label eyebrow">0{projects.indexOf(hovered) + 1} / {hovered.name.toUpperCase()}</span>
            </div>
          )}
        </div>, document.body,
      )}
    </div>
  );
}
