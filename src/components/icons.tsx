import type { CSSProperties } from 'react';

/* Services / hero deck */
import aiProductEngineering from '../assets/icons/ai-product-engineering.png';
import llmRagSystems from '../assets/icons/llm-rag-systems.png';
import backendApiDesign from '../assets/icons/backend-api-design.png';
import deploymentSecurity from '../assets/icons/deployment-security.png';

/* Selected work */
import workTrubbi from '../assets/icons/work-trubbi.png';
import workAddvancedAi from '../assets/icons/work-addvanced-ai.png';
import workElyxaAi from '../assets/icons/work-elyxa-ai.png';
import workPeakPhysique from '../assets/icons/work-peak-physique.png';
import workPowerPlayMortgage from '../assets/icons/work-power-play-mortgage.png';
import work8888Augusta from '../assets/icons/work-8888-augusta.png';

/* Toolkit */
import toolkitAiMl from '../assets/icons/toolkit-ai-ml.png';
import toolkitBackend from '../assets/icons/toolkit-backend.png';
import toolkitFrontend from '../assets/icons/toolkit-frontend.png';
import toolkitDevops from '../assets/icons/toolkit-devops.png';

type IconEntry = {
  src: string;
  render?: 'mask' | 'image';
  scale?: number;
  source?: string;
};

const registry = {
  /* ---- Services / hero deck ---- */
  'ai-engineering': { src: aiProductEngineering, source: '1693746' },
  'llm-rag': { src: llmRagSystems, source: '2152343' },
  'backend-api': { src: backendApiDesign, source: '8750798' },
  'deploy-security': { src: deploymentSecurity, source: '743885' },

  /* ---- Selected work ---- */
  'group-trip': { src: workTrubbi, render: 'image', source: '4807598' },
  'deal-radar': { src: workAddvancedAi, source: '17772840' },
  'ai-model': { src: workElyxaAi, source: '16209773' },
  fitness: { src: workPeakPhysique, source: '15837400' },
  'mortgage-home': { src: workPowerPlayMortgage, source: '9651303' },
  // Filled artwork - see the trade-off note above.
  landmark: { src: work8888Augusta, render: 'image', source: '3862921' },

  /* ---- Toolkit ---- */
  'ai-ml': { src: toolkitAiMl, source: '13708311' },
  'backend-eng': { src: toolkitBackend, source: '17234310' },
  'frontend-eng': { src: toolkitFrontend, source: '11869427' },
  'devops-sec': { src: toolkitDevops, source: '12219584' },
} as const satisfies Record<string, IconEntry>;

export type IconName = keyof typeof registry;

export default function Icon({
  name,
  className = 'h-5 w-5',
  title,
}: {
  name: IconName;
  className?: string;
  title?: string;
}) {
  const entry: IconEntry = registry[name];
  const { src, render = 'mask', scale = 1 } = entry;

  const a11y = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true as const };

  const style: CSSProperties = scale === 1 ? {} : { transform: `scale(${scale})` };

  if (render === 'image') {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className={`${className} object-contain`}
        style={style}
        {...a11y}
      />
    );
  }

  return (
    <span
      className={`icon-mask ${className}`}
      style={{ ...style, ['--icon' as string]: `url(${src})` }}
      {...a11y}
    />
  );
}