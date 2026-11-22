import { useEffect, useState } from 'react';

function readFlags() {
  if (typeof window === 'undefined') return { reduced: false, compact: false, lowPower: false, finePointer: false };
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    compact: window.matchMedia('(max-width: 800px)').matches,
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    lowPower: Boolean(connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)),
  };
}

export function useMediaFlags() {
  const [flags, setFlags] = useState(readFlags);

  useEffect(() => {
    const queries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(max-width: 800px)'),
      window.matchMedia('(hover: hover) and (pointer: fine)'),
    ];
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const update = () => setFlags(readFlags());
    queries.forEach(query => query.addEventListener('change', update));
    connection?.addEventListener?.('change', update);
    return () => {
      queries.forEach(query => query.removeEventListener('change', update));
      connection?.removeEventListener?.('change', update);
    };
  }, []);

  return flags;
}
