import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({
  children,
  className = '',
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 220,
    damping: 22,
  });
  const scale = useSpring(1, { stiffness: 220, damping: 22 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => scale.set(1.02)}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
        scale.set(1);
      }}
      style={{ rotateX, rotateY, scale, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
