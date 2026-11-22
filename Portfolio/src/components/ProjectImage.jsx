export default function ProjectImage({ project, eager = false }) {
  if (!project.image) {
    return (
      <div className="signspace-art" role="img" aria-label={project.imageAlt}>
        <div className="signspace-art__grid" aria-hidden="true" />
        <svg viewBox="0 0 440 300" fill="none" aria-hidden="true" className="signspace-art__drawing">
          <path d="M75 242c37-4 46-45 85-53 26-5 30 29 57 15 36-19 17-79 49-89 22-7 21 27 51 16 18-7 31-29 55-34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 10" />
          <path d="M163 155c-10-21-13-42-10-56 2-10 10-13 16-8l24 40-15-60c-3-13 9-19 17-9l26 63-11-63c-2-14 12-18 19-5l22 61-5-42c-2-12 10-17 17-7l15 42c7 19 11 42 4 63l-15 43-62 7-31-42-28-37c-8-12 1-22 11-18l28 29" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="169" cy="91" r="5" fill="currentColor" /><circle cx="195" cy="62" r="5" fill="currentColor" /><circle cx="229" cy="57" r="5" fill="currentColor" /><circle cx="263" cy="69" r="5" fill="currentColor" />
          <path d="M36 44h34M36 44v34M404 44h-34M404 44v34M36 256h34M36 256v-34M404 256h-34M404 256v-34" stroke="currentColor" strokeWidth="1.5" opacity=".55" />
        </svg>
      </div>
    );
  }

  return (
    <picture>
      {project.webp && <source srcSet={project.webp.replace('.webp', '-sm.webp')} media="(max-width: 640px)" type="image/webp" />}
      {project.webp && <source srcSet={project.webp} type="image/webp" />}
      <img
        src={project.image}
        alt={project.imageAlt}
        width={project.width}
        height={project.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}
