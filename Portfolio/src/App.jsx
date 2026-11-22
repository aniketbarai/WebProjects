import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { projects } from './data/projects';
import { useMediaFlags } from './hooks/useMediaFlags';
import { useScrollExperience } from './hooks/useScrollExperience';
import Navbar from './components/Navbar';
import SceneLayer from './components/SceneLayer';
import Preloader from './components/Preloader';
import ProjectCard from './components/ProjectCard';
import ProjectIndex from './components/ProjectIndex';

const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const marqueeItems = ['Java', 'JavaScript', 'Python', 'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind', 'OpenCV'];
const skillGroups = [
  { number: '01', title: 'Frontend', skills: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS'] },
  { number: '02', title: 'Backend & data', skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs'] },
  { number: '03', title: 'Languages & exploration', skills: ['Java', 'Python', 'OpenCV', 'MediaPipe', 'AI tools'] },
];
const workflow = [
  ['01', 'React', 'Interface'],
  ['02', 'REST API', 'Connection'],
  ['03', 'Express + JWT', 'Logic & access'],
  ['04', 'MongoDB', 'Data'],
  ['05', 'Cloudinary / ImageKit', 'Media'],
  ['06', 'Vercel / Render', 'Deployment'],
];

function MaskLine({ children, hero = false }) {
  // The trailing space keeps adjacent visual lines readable as one sentence in
  // text extraction and screen readers; CSS collapses it visually.
  return <span className="mask-line"><span className={hero ? 'hero-line-inner' : 'line-inner'}>{children}</span>{' '}</span>;
}

function SectionTop({ number, label, right }) {
  return <div className="section-top eyebrow" data-reveal><span>{number} / {label}</span><span>{right}</span></div>;
}

function Marquee({ staticMode }) {
  return (
    <div className={`skills-marquee${staticMode ? ' skills-marquee--static' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map(copy => (
          <div className="marquee-set" key={copy}>
            {marqueeItems.map(item => <span key={item}>{item}<i>✳</i></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const flags = useMediaFlags();
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const dragRef = useRef(null);
  const projectOpener = useRef(null);
  const onSectionChange = useCallback(id => setActive(id), []);
  const openProject = useCallback((project, trigger) => {
    projectOpener.current = trigger || document.activeElement;
    setSelectedProject(project);
  }, []);
  const closeProject = useCallback(() => setSelectedProject(null), []);
  const { scrollTo, focusCard, dragTo, lenisRef } = useScrollExperience({
    reduced: flags.reduced,
    compact: flags.compact,
    lowPower: flags.lowPower,
    onSectionChange,
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171714' : '#F5F2EB');
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Storage can be disabled. */ }
  }, [theme]);

  useEffect(() => {
    const locked = menuOpen || Boolean(selectedProject);
    const oldOverflow = document.body.style.overflow;
    const main = document.getElementById('site-main');
    const footer = document.getElementById('site-footer');
    document.body.style.overflow = locked ? 'hidden' : '';
    if (main) main.inert = locked;
    if (footer) footer.inert = locked;
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
    return () => {
      document.body.style.overflow = oldOverflow;
      if (main) main.inert = false;
      if (footer) footer.inert = false;
    };
  }, [menuOpen, selectedProject, lenisRef]);

  // The opening button becomes inert behind the lazy dialog. Restore focus
  // only after the dialog unmounts and the background has been unlocked.
  useEffect(() => {
    if (selectedProject || !projectOpener.current) return undefined;
    const opener = projectOpener.current;
    projectOpener.current = null;
    const frame = requestAnimationFrame(() => { if (opener?.isConnected) opener.focus({ preventScroll: true }); });
    return () => cancelAnimationFrame(frame);
  }, [selectedProject]);

  function navigate(event, id) {
    event.preventDefault();
    scrollTo(id);
  }

  function startDrag(event) {
    if (event.pointerType !== 'mouse') return;
    event.preventDefault();
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, scroll: window.scrollY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event) {
    if (dragRef.current?.pointerId === event.pointerId) dragTo(dragRef.current.scroll + dragRef.current.x - event.clientX);
  }
  function stopDrag(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  }

  return (
    <>
      <Navbar active={active} scrollTo={scrollTo} theme={theme} toggleTheme={() => setTheme(current => current === 'light' ? 'dark' : 'light')} menuOpen={menuOpen} setMenuOpen={setMenuOpen} reduced={flags.reduced} />
      <SceneLayer reduced={flags.reduced} compact={flags.compact} lowPower={flags.lowPower} active={active} obscured={menuOpen || Boolean(selectedProject)} />
      {!flags.reduced && !flags.compact && !flags.lowPower && flags.finePointer && !menuOpen && !selectedProject && (
        <Suspense fallback={null}><CustomCursor enabled /></Suspense>
      )}
      <Preloader reduced={flags.reduced || flags.compact || flags.lowPower} />

      <main id="site-main">
        {/* 00 / HERO */}
        <section id="hero" className="hero" aria-labelledby="hero-title">
          <div className="hero__top content-width hero-reveal eyebrow">
            <span>00 / AN INTRODUCTION</span>
            <span className="availability"><span className="availability__dot" /> OPEN TO INTERNSHIPS &amp; FREELANCE</span>
          </div>
          <div className="hero__body content-width">
            <div className="hero__lead">
              <p className="hero__overline eyebrow hero-reveal">ANIKET BARAI <span aria-hidden="true">/</span> MUMBAI, INDIA</p>
              <h1 id="hero-title" className="hero__title font-display">
                <MaskLine hero>Full-stack</MaskLine>
                <MaskLine hero>developer <em className="font-serif">&amp;</em></MaskLine>
                <MaskLine hero>founder<span className="accent-dot">.</span></MaskLine>
              </h1>
              <div className="hero__summary hero-reveal">
                <div className="hero__profile">
                  <p className="hero__studio"><span className="eyebrow">FOUNDER @</span><strong className="font-display">PrimeCodeStudio<span className="accent-dot">.</span></strong></p>
                  <dl className="hero__profile-list">
                    <div><dt>MERN SPECIALIST</dt><dd>React · MongoDB</dd></div>
                    <div><dt>UPSKILLING</dt><dd>AI/ML · DevOps</dd></div>
                  </dl>
                </div>
                <div className="hero__actions">
                  <a href="#projects" onClick={event => navigate(event, 'projects')} className="button button--primary" data-magnetic data-cursor="GO">VIEW WORK <span aria-hidden="true">↗</span></a>
                  <a href="/Asset/Aniket_Barai_CV.pdf" download className="button button--text" data-magnetic data-cursor="GET">DOWNLOAD RESUME <span aria-hidden="true">↘</span></a>
                </div>
              </div>
            </div>
            <figure className="hero__portrait hero-reveal">
              <div className="hero__portrait-frame" data-unveil>
                <picture>
                  <source srcSet="/Asset/Aniket_latest-sm.webp" media="(max-width: 640px)" type="image/webp" />
                  <source srcSet="/Asset/Aniket_latest.webp" type="image/webp" />
                  <img src="/Asset/Aniket_latest.jpg" alt="Aniket Barai holding an award outdoors" width="1592" height="1592" fetchPriority="high" />
                </picture>
              </div>
              <figcaption className="eyebrow"><span>FIG. 01 — THE PERSON BEHIND THE PIXELS</span><span>19° 04′ N / 72° 53′ E</span></figcaption>
            </figure>
          </div>
          <div className="hero__foot content-width hero-reveal eyebrow">
            <a href="#projects" onClick={event => navigate(event, 'projects')} data-cursor="GO">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
            <span>DESIGN-MINDED. ENGINEERING-DRIVEN.</span>
          </div>
        </section>

        {/* 01 / WORK — pinned on desktop; a normal vertical list on mobile/reduced motion. */}
        <section id="projects" className={`work-section${flags.lowPower ? ' work-section--lite' : ''}`} aria-labelledby="work-title">
          <div className="projects-pin">
            <div className="work-section__head content-width">
              <SectionTop number="01" label="SELECTED WORK" right="CLIENT WORK & INDEPENDENT IDEAS" />
              <div className="work-section__title-row">
                <h2 id="work-title" className="section-title font-display" data-reveal-lines><MaskLine>Ideas made <em className="font-serif">real.</em></MaskLine></h2>
                <p data-reveal>From shipped client products to experiments in what comes next. Start with the work.</p>
              </div>
            </div>
            <div className="project-viewport">
              <div className="project-rail">
                {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} onSelect={openProject} onFocus={focusCard} interactive={flags.finePointer && !flags.reduced && !flags.compact && !flags.lowPower} />)}
              </div>
            </div>
            <div className="work-section__foot content-width eyebrow">
              <span>0{projects.length} PROJECTS / 02 CLIENT LAUNCHES</span>
              <div className="work-drag" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={() => { dragRef.current = null; }} data-cursor="DRAG" aria-hidden="true">DRAG TO EXPLORE <span>↔</span></div>
            </div>
          </div>
          <ProjectIndex onSelect={openProject} enabled={flags.finePointer && !flags.reduced && !flags.compact && !flags.lowPower} />
        </section>

        {/* 02 / ABOUT */}
        <section id="about" className="about-section section-space" aria-labelledby="about-title">
          <div className="ghost-word font-display" data-parallax aria-hidden="true">ABOUT</div>
          <div className="content-width section-content">
            <SectionTop number="02" label="ABOUT" right="MORE THAN A JOB TITLE" />
            <div className="about-grid">
              <div>
                <h2 id="about-title" className="section-title font-display" data-reveal-lines>
                  <MaskLine>Built on</MaskLine><MaskLine><em className="font-serif">curiosity.</em></MaskLine>
                </h2>
                <blockquote className="about-quote font-serif" data-reveal>“Engineer who ships,<br /> not just studies<span className="accent-dot">.</span>”</blockquote>
              </div>
              <div className="about-copy" data-reveal>
                <p>I'm Aniket Barai, a full-stack developer from Mumbai. Since February 2026, I've taken freelance projects from the first conversation through development, deployment, and handover.</p>
                <p>Alongside client work, I'm studying Computer Engineering at Government Polytechnic Mumbai and exploring computer vision with OpenCV and MediaPipe, plus new ways to build with AI tools.</p>
                <div className="about-stats">
                  <div aria-label="Two client projects delivered"><span data-count="2">2</span><small>CLIENT PROJECTS<br />DELIVERED</small></div>
                  <div aria-label="93.33 percent diploma average"><span data-count="93.33" data-decimals="2" data-suffix="%">93.33%</span><small>DIPLOMA<br />AVERAGE</small></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / SKILLS */}
        <section id="skills" className="skills-section section-space" aria-labelledby="skills-title">
          <Marquee staticMode={flags.lowPower} />
          <div className="content-width section-content">
            <SectionTop number="03" label="EXPERTISE" right="TOOLS IN SERVICE OF IDEAS" />
            <div className="skills-section__intro">
              <h2 id="skills-title" className="section-title font-display" data-reveal-lines><MaskLine>Good ideas need</MaskLine><MaskLine><em className="font-serif">good execution.</em></MaskLine></h2>
              <p data-reveal>I choose the tools that serve the problem, then build the whole thing.</p>
            </div>
            <div className="skills-grid">
              {skillGroups.map(group => (
                <div className="skill-group" key={group.title} data-reveal>
                  <div className="skill-group__heading eyebrow"><span>{group.number}</span><h3>{group.title}</h3></div>
                  <ul>{group.skills.map(skill => <li key={skill}>{skill}<span aria-hidden="true">↗</span></li>)}</ul>
                </div>
              ))}
            </div>
            <div className="workflow" data-reveal>
              <div className="workflow__heading"><span className="eyebrow">HOW I SHIP A PRODUCT</span><p>From first screen to production.</p></div>
              <ol>{workflow.map(([number, name, role]) => <li key={number}><span className="eyebrow">{number}</span><strong>{name}</strong><small>{role}</small></li>)}</ol>
            </div>
          </div>
        </section>

        {/* 04 / EXPERIENCE */}
        <section id="experience" className="experience-section section-space" aria-labelledby="experience-title">
          <div className="content-width section-content">
            <SectionTop number="04" label="EXPERIENCE" right="REAL WORK, REAL RESPONSIBILITY" />
            <div className="experience-grid">
              <div className="experience-grid__intro">
                <h2 id="experience-title" className="section-title font-display" data-reveal-lines><MaskLine>From brief</MaskLine><MaskLine>to <em className="font-serif">browser.</em></MaskLine></h2>
                <p data-reveal>Not just what I know. What I've been trusted to do.</p>
              </div>
              <div className="timeline">
                <article className="timeline__item" data-reveal>
                  <span className="timeline__date eyebrow">FEB 2026 — PRESENT</span>
                  <div><h3>Freelance Full-Stack Developer</h3><p className="timeline__place">Self-employed · Mumbai, India</p><p>Two client projects delivered end to end: requirements, development, deployment, and handover. Building storefronts, dashboards, and content experiences that work outside a demo.</p><div className="timeline__steps eyebrow"><span>BRIEF</span><span>→</span><span>BUILD</span><span>→</span><span>DEPLOY</span><span>→</span><span>HANDOVER</span></div></div>
                </article>
                <article className="timeline__item" data-reveal>
                  <span className="timeline__date eyebrow">THREE SEMESTERS</span>
                  <div><h3>Class Representative</h3><p className="timeline__place">Government Polytechnic Mumbai</p><p>Coordinated academic activities and helped keep communication flowing between students and faculty across three consecutive semesters.</p></div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* 05 / EDUCATION & ACHIEVEMENTS */}
        <section id="education" className="education-section section-space" aria-labelledby="education-title">
          <div className="content-width section-content">
            <SectionTop number="05" label="FOUNDATIONS" right="LEARNING BY DOING" />
            <h2 id="education-title" className="section-title font-display" data-reveal-lines><MaskLine>Always learning.</MaskLine><MaskLine><em className="font-serif">Always building.</em></MaskLine></h2>
            <div className="education-grid">
              <div data-reveal>
                <h3 className="eyebrow education-grid__label">EDUCATION / 01—02</h3>
                <article className="education-entry"><span className="eyebrow">SEP 2024 — PRESENT</span><h4>Diploma in Computer Engineering</h4><p>Government Polytechnic Mumbai</p><strong>93.33% <span>AVERAGE</span></strong></article>
                <article className="education-entry"><span className="eyebrow">MAR 2024</span><h4>SSC Board</h4><p>Guru Nanak High School, Mumbai</p></article>
              </div>
              <div data-reveal>
                <h3 className="eyebrow education-grid__label">NOTABLE MOMENTS / 01—02</h3>
                <div className="achievement"><strong className="font-serif">1<sup>st</sup></strong><p>Technical quiz winner<br /><span>Among 20 teams</span></p></div>
                <div className="achievement"><strong className="font-serif">#9</strong><p>GeeksforGeeks campus rank<br /><span>Out of 172 users</span></p></div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 / CONTACT */}
        <section id="contact" className="contact-section section-space" aria-labelledby="contact-title">
          <div className="ghost-word font-display" data-parallax aria-hidden="true">HELLO</div>
          <div className="content-width section-content">
            <SectionTop number="06" label="CONTACT" right="THE NEXT PROJECT STARTS HERE" />
            <p className="contact-section__overline eyebrow" data-reveal><span className="availability__dot" /> AVAILABLE FOR INTERNSHIPS &amp; FREELANCE</p>
            <h2 id="contact-title" className="contact-title font-display" data-reveal-lines><MaskLine>Have something</MaskLine><MaskLine><em className="font-serif">worth building?</em></MaskLine></h2>
            <a className="contact-section__cta font-display" href="mailto:aniketbarai678@gmail.com" data-magnetic data-cursor="MAIL">LET'S TALK <span aria-hidden="true">↗</span></a>
            <div className="contact-grid" data-reveal>
              <div><span className="eyebrow">DROP ME A LINE</span><a href="mailto:aniketbarai678@gmail.com">aniketbarai678@gmail.com</a><a href="tel:+917304414905">+91 73044 14905</a></div>
              <div><span className="eyebrow">FIND ME ELSEWHERE</span><a href="https://www.linkedin.com/in/aniketbarai/" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a><a href="https://github.com/aniketbarai" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="https://codolio.com/profile/aniketbarai" target="_blank" rel="noopener noreferrer">CODOLIO ↗</a></div>
              <div><span className="eyebrow">BASED IN</span><p>Mumbai, India<br />Open to new opportunities.</p></div>
            </div>
          </div>
        </section>
      </main>

      <footer id="site-footer" className="site-footer content-width eyebrow">
        <span>© {new Date().getFullYear()} ANIKET BARAI. BUILT WITH INTENTION.</span>
        <a href="#hero" onClick={event => navigate(event, 'hero')} data-cursor="TOP">BACK TO TOP ↑</a>
      </footer>
      {selectedProject && (
        <Suspense fallback={<div className="detail-loading eyebrow" role="status">OPENING {selectedProject.name.toUpperCase()}…</div>}>
          <ProjectDetail key={selectedProject.slug} project={selectedProject} onClose={closeProject} reduced={flags.reduced} />
        </Suspense>
      )}
    </>
  );
}
