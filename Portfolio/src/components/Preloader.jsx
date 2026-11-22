import { useEffect, useState } from 'react';

// A CSS exit keeps the splash tiny; Framer Motion is loaded later only when
// somebody opens the navigation or a case study.
export default function Preloader({ reduced }) {
  const [stage, setStage] = useState(() => reduced ? 'hidden' : 'visible');

  useEffect(() => {
    if (reduced) { setStage('hidden'); return undefined; }
    const exit = setTimeout(() => setStage('leaving'), 850);
    const finish = setTimeout(() => setStage('hidden'), 1400);
    // Do not trap keyboard users behind a decorative opening screen.
    const skipForKeyboard = event => {
      if (event.key !== 'Tab') return;
      clearTimeout(exit);
      clearTimeout(finish);
      setStage('hidden');
    };
    document.addEventListener('keydown', skipForKeyboard);
    return () => {
      clearTimeout(exit);
      clearTimeout(finish);
      document.removeEventListener('keydown', skipForKeyboard);
    };
  }, [reduced]);

  if (stage === 'hidden') return null;
  return (
    <div className={`preloader${stage === 'leaving' ? ' preloader--leaving' : ''}`} aria-hidden="true">
      <div className="preloader__wordmark"><span>ANIKET</span><span className="preloader__serif">Barai.</span></div>
      <div className="preloader__foot"><span>FULL-STACK DEVELOPER</span><span>MUMBAI / INDIA</span></div>
    </div>
  );
}
