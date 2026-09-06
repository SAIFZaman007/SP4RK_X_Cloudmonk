import { useEffect, useSyncExternalStore } from 'react';
import { motionValue, type MotionValue } from 'framer-motion';

/**
 * A single, shared source of truth for where the pointer is.
 *
 * Magnetic elements need the cursor position even when it is *not* over them -
 * that proximity is the whole effect. The naive version gives every card its
 * own `window` pointermove listener, so a four-card grid runs four handlers per
 * move event and each one independently schedules work. Here one listener
 * feeds two module-level MotionValues that every consumer reads, so the cost is
 * flat no matter how many cards subscribe.
 *
 * The listener is reference-counted: it attaches when the first consumer mounts
 * and detaches when the last unmounts, so a page with no magnetic elements on
 * screen pays nothing.
 *
 * Values are viewport coordinates (clientX/clientY). Consumers convert to
 * element-local space themselves, because only they know their own rect.
 */
const pointerX = motionValue(-9999);
const pointerY = motionValue(-9999);

let subscribers = 0;
let detach: (() => void) | null = null;

/**
 * Coarse pointers (touch) have no hover state; magnetism there is a bug - the
 * card would latch into a pulled position on tap and stay there.
 *
 * Read through useSyncExternalStore rather than an effect, because this is
 * exactly what that hook is for: state that lives outside React and can change
 * on its own. It genuinely does change - plugging a mouse into a tablet, or
 * dragging the window to a touchscreen - and the server snapshot returning
 * false is what keeps the prerendered HTML free of pointer-dependent markup.
 */
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

// Created once. matchMedia() returns a fresh object each call, so building one
// inside the getSnapshot callback would hand React a new identity every render
// and defeat its bail-out check.
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

  // pointermove fires far more often than the display refreshes. Coalescing
  // into one rAF means the MotionValues update at most once per frame, which
  // is the most any consumer can render anyway.
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

  // Parking the pointer far off-screen releases every card back to rest
  // instead of freezing them mid-pull at the edge of the window.
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
