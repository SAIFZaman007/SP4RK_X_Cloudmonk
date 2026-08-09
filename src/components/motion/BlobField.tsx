import { motion, useReducedMotion } from 'framer-motion';

const blobs = [
  { size: 560, color: '#DF3640', top: '-14%', left: '2%', dur: 15, opacity: 0.32 },
  { size: 460, color: '#96202B', top: '10%', left: '58%', dur: 19, opacity: 0.28 },
  { size: 420, color: '#EDC0AE', top: '58%', left: '18%', dur: 17, opacity: 0.22 },
  { size: 360, color: '#741B3A', top: '62%', left: '68%', dur: 21, opacity: 0.2 },
];

export default function BlobField({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: b.color,
            opacity: b.opacity,
            filter: 'blur(90px)',
          }}
          animate={
            reduce
              ? { x: 0, y: 0, scale: 1 }
              : {
                  x: [0, 46, -34, 0],
                  y: [0, -34, 24, 0],
                  scale: [1, 1.16, 0.94, 1],
                }
          }
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
