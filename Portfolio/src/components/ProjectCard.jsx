import ProjectImage from './ProjectImage';
import { projects } from '../data/projects';

export default function ProjectCard({ project, index, onSelect, onFocus, interactive }) {
  function tilt(event) {
    if (!interactive) return;
    const shell = event.currentTarget;
    const rect = shell.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    shell.style.setProperty('--tilt-y', `${x * 7}deg`);
    shell.style.setProperty('--tilt-x', `${-y * 5}deg`);
    shell.style.setProperty('--lift-x', `${x * 12}px`);
    shell.style.setProperty('--lift-y', `${y * 12}px`);
  }
  function reset(event) {
    const shell = event.currentTarget;
    ['--tilt-x', '--tilt-y', '--lift-x', '--lift-y'].forEach(property => shell.style.removeProperty(property));
  }

  return (
    <article className={`project-card${project.featured ? ' project-card--featured' : ''}`} data-project-index={index} onFocusCapture={event => {
      event.currentTarget.classList.remove('scroll-pending');
      onFocus(index);
    }}>
      <div className="project-card__shell" onPointerMove={tilt} onPointerLeave={reset}>
        <div className="project-card__meta eyebrow"><span>0{index + 1} / 0{projects.length}</span><span>{project.category}</span></div>
        <button type="button" className="project-card__cover" onClick={event => onSelect(project, event.currentTarget)} aria-label={`${project.name} view project details`} data-cursor="VIEW">
          <div className="project-card__visual" data-unveil={project.featured ? '' : undefined}>
            <ProjectImage project={project} />
          </div>
          <span className="project-card__view" aria-hidden="true">VIEW PROJECT <span>↗</span></span>
        </button>
        <div className="project-card__info">
          <div>
            <h3 className="font-display">{project.name}<span className="project-card__period">.</span></h3>
            <p className="font-serif">{project.descriptor}</p>
          </div>
          <div className="project-card__links">
            {project.live
              ? <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} live site, opens in a new tab`} data-cursor="OPEN">LIVE ↗</a>
              : <span className="eyebrow">{project.status}</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
