import { useEffect, useSyncExternalStore } from 'react';
import { motionValue, type MotionValue } from 'framer-motion';

const pointerX = motionValue(-9999);
const pointerY = motionValue(-9999);

let subscribers = 0;
let detach: (() => void) | null = null;

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

let finePointerQuery: MediaQueryList | null = null;
function query() {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  finePointerQuery ??= window.matchMedia(FINE_POINTER);
  return finePointerQuery;
}

function subscribeToPointerType(onChange: () => void) {
  const mq = query();
  if (!mq) return () => {};
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getPointerIsFine = () => query()?.matches ?? false;
const getPointerIsFineOnServer = () => false;

function attach() {
  if (detach) return;

  let frame = 0;
  let nextX = pointerX.get();
  let nextY = pointerY.get();

  const flush = () => {
    frame = 0;
    pointerX.set(nextX);
    pointerY.set(nextY);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    nextX = e.clientX;
    nextY = e.clientY;
    if (!frame) frame = requestAnimationFrame(flush);
  };

  const onLeave = () => {
    nextX = -9999;
    nextY = -9999;
    if (!frame) frame = requestAnimationFrame(flush);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);

  detach = () => {
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
    detach = null;
  };
}

export function usePointer(): {
  x: MotionValue<number>;
  y: MotionValue<number>;
  enabled: boolean;
} {
  const enabled = useSyncExternalStore(
    subscribeToPointerType,
    getPointerIsFine,
    getPointerIsFineOnServer
  );

  useEffect(() => {
    if (!enabled) return;

    subscribers += 1;
    attach();

    return () => {
      subscribers -= 1;
      if (subscribers === 0) detach?.();
    };
  }, [enabled]);

  return { x: pointerX, y: pointerY, enabled };
}