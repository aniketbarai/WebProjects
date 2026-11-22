import { Component, lazy, Suspense, useEffect, useState } from 'react';

const ThreeScene = lazy(() => import('./ThreeScene'));

class CanvasBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function SceneLayer({ reduced, compact, lowPower, active, obscured }) {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const canRender = !reduced && !compact && !lowPower;
  // Without animated 3D, avoid repeating one fixed shape over every paragraph.
  const staticClass = canRender || active === 'hero' ? '' : active === 'contact' ? ' scene-layer--contact' : ' scene-layer--quiet';

  useEffect(() => {
    if (!canRender) { setLoad(false); setReady(false); return undefined; }
    // Defer the entire Three/R3F bundle until the browser has painted content.
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      // Check API support without allocating a second GPU context. The
      // boundary restores the SVG if the actual renderer cannot initialize.
      if (window.WebGL2RenderingContext || window.WebGLRenderingContext) setLoad(true);
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1700 })
      : window.setTimeout(start, 1000);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, [canRender]);

  return (
    <div className={`scene-layer${ready && canRender ? ' scene-layer--ready' : ''}${staticClass}`} aria-hidden="true">
      <div className="scene-placeholder" />
      {canRender && load && (
        <CanvasBoundary onFailure={() => setReady(false)}>
          <Suspense fallback={null}><ThreeScene onReady={() => setReady(true)} paused={obscured} /></Suspense>
        </CanvasBoundary>
      )}
    </div>
  );
}
