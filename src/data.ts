import type { IconName } from './components/icons';

/* ---------------------------------------------------------------------------
 * ALL editable content lives in this file. Components never hardcode copy.
 *
 * Items marked [CONFIRM] are values I inferred and you should verify before
 * going live. Grep for "[CONFIRM]" to find them all.
 * ------------------------------------------------------------------------- */

export const site = {
  name: 'Saif Zaman',
  legalName: 'Md. Saifuzzaman Naim',
  // Short brand handle - used only where the mark, not the full name, should
  // carry (footer wordmark). Everywhere else uses `name` or `legalName`.
  brand: 'SP4RK',
  role: 'AI-SaaS Engineer',
  title: 'Saif Zaman | AI-SaaS Engineer - Full-Stack, ML & Secure Systems',
  description:
    'AI-SaaS engineer in Dhaka, Bangladesh. I ship production AI products end to end - FastAPI and React systems, LLM and RAG pipelines, payments, and the infrastructure they run on. Available for contract work and full-time roles.',
  url: 'https://cloudmonk.cc',
  email: 'spark@cloudmonk.cc',
  cvLink: '/media/Saif_Zaman_CV.pdf',
  linkedin: 'https://www.linkedin.com/in/saifzaman',
  github: 'https://github.com/SAIFZaman007',
};

export const hero = {
  eyebrow: 'AI-SaaS Engineer - Dhaka, BD',
  headline: ['AI products', 'that survive', 'production.'],
  subtitle:
    'I build and ship full-stack AI systems end to end - FastAPI and React, LLM and RAG pipelines, payments, auth, and the deployment around them. Currently leading AI-SaaS engineering at Maktech, and taking on select contract work.',
  status: 'Available for projects',
  stats: [
    { number: 20, suffix: '+', label: 'products shipped live' },
    { number: 7, suffix: '+', label: 'yrs writing code' },
    { number: 24, suffix: 'h', label: 'response time' },
  ],
  // An honest stand-in for a client-logo row: what the work actually runs on.
  stack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker', 'PyTorch', 'Redis', 'Stripe'],
};

export const about = {
  image: '/portrait.jpg',
  imageWebp: '/portrait.webp',
  quickFacts: [
    { label: 'Based in', value: 'Dhaka, Bangladesh' },
    { label: 'Role', value: 'AI-SaaS Engineer, Maktech' },
    { label: 'Available for', value: 'Contract · Full-time' },
    { label: 'Response time', value: 'Within 24 hours' },
  ],
  paragraphs: [
    "I'm an AI-SaaS engineer in Dhaka. My work sits where machine learning, web engineering, and security overlap - I build systems that are precise, hold up under real load, and stay secure while doing it.",
    'At <strong>Maktech</strong> I lead AI-SaaS engineering, taking products from a rough brief through architecture, build, and deployment. Alongside that I take on <strong>select contract work</strong> for clients internationally, mostly full-stack AI and SaaS builds.',
    'My core stack is <strong>Python and FastAPI on the backend, React and TypeScript on the front</strong>, with PostgreSQL, Docker, and CI around it. Where a project needs models rather than APIs, I work in PyTorch and TensorFlow - and I care as much about the auth, payment, and deployment layers as the model itself, because that is where products actually break.',
  ],
};

export const services: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'stack',
    title: 'AI Product Engineering',
    desc: 'End-to-end SaaS builds - FastAPI backends, React front ends, Postgres schemas, auth and payments. Delivered as something you can hand to users, not a prototype that needs a rewrite.',
  },
  {
    icon: 'mesh',
    title: 'LLM & RAG Systems',
    desc: 'Retrieval pipelines over your own data using pgvector, ChromaDB, or Pinecone - with evaluation, cost control, and fallbacks, so answers stay grounded instead of confidently wrong.',
  },
  {
    icon: 'database',
    title: 'Backend & API Design',
    desc: 'Typed, documented REST APIs with OpenAPI, sane migrations, and background jobs. Built so the next engineer can read the codebase without a handover call.',
  },
  {
    icon: 'shield',
    title: 'Deployment & Security',
    desc: 'Dockerised deploys, CI pipelines, health checks, and hardened headers. A network-security background, applied to the boring parts that decide whether a launch holds.',
  },
];

/* Selected work. Live links only - no client names, no internal detail. */
export const projects: {
  icon: IconName;
  title: string;
  desc: string;
  tags: string[];
  url?: string;
}[] = [
  {
    icon: 'mesh',
    title: 'Trubbi - Group Trip Planning',
    desc: 'A group travel planning product built to take the coordination chaos out of planning a trip with friends. Shipped through launch and waitlist onboarding.',
    tags: ['React', 'FastAPI', 'PostgreSQL'],
    url: 'https://www.trubbi.ai/',
  },
  {
    icon: 'radar',
    title: 'Addvanced AI - Deal Hunter',
    desc: 'An AI deal-discovery platform that surfaces and ranks offers automatically, replacing manual comparison with a scored feed.',
    tags: ['Python', 'React', 'LLM'],
    url: 'https://addvancedai.com/',
  },
  {
    icon: 'stack',
    title: 'Elyxa AI',
    desc: 'An AI SaaS platform delivered end to end - product surface, API layer, and deployment, shipped for real users from day one.',
    tags: ['React', 'FastAPI', 'AI'],
    url: 'https://elyxaai.com/',
  },
  {
    icon: 'pulse',
    title: 'TrainPeak Physique',
    desc: 'A fitness and coaching platform covering programme delivery and client management, built to keep coaches and clients in sync.',
    tags: ['Full-Stack', 'Web App'],
    url: 'https://trainpeakphysique.com/',
  },
  {
    icon: 'web',
    title: 'Maktech Group',
    desc: 'The corporate web presence for Maktech, built and maintained in house alongside the AI-SaaS product work.',
    tags: ['Web', 'Performance', 'SEO'],
    url: 'https://maktechgroup.com',
  },
  {
    icon: 'server',
    title: '8888 Masters',
    desc: 'A dedicated product platform delivered under the Maktech group, covering portfolio, events, and local info end to end.',
    tags: ['Full-Stack', 'Deployment'],
    url: 'https://8888masters.maktechgroups.com/',
  },
];

export const experience = [
  {
    role: 'AI-SaaS Engineer · Team Lead', // [CONFIRM] title as you want it read
    company: 'Maktech',
    period: 'Jan 2026 - Present',
    desc: 'Lead the AI-SaaS team, owning product architecture and delivery across FastAPI, React, and Postgres builds - from scoping through deployment, payments, and post-launch support.',
  },
  {
    role: 'Intern, AI-SaaS',
    company: 'Maktech',
    period: 'Nov 2025 - Dec 2025',
    desc: 'Joined as an intern on the AI-SaaS team and shipped production features within the first two months, moving into the team lead role in January.',
  },
  {
    role: 'Quality Assurance Intern',
    company: 'Summit Towers Limited',
    period: 'Aug 2025 - Oct 2025',
    desc: 'Quality & Service Assurance department - snag analysis, data backup, and ad-hoc project management across telecommunications engineering and vendor management.',
  },
  {
    role: 'Freelance Engineer',
    company: 'Independent',
    period: '2024 - Present',
    desc: 'Contract full-stack, AI, and SaaS delivery for international clients - scoping, architecture, build, and handover, working asynchronously across time zones.',
  },
];

export const skills = [
  {
    category: 'AI & Machine Learning',
    items: [
      'Deep Learning (PyTorch, TensorFlow)',
      'LLM & RAG Pipelines (pgvector, ChromaDB, Pinecone)',
      'Computer Vision (OpenCV, YOLO)',
      'Data & Analysis (Pandas, NumPy, scikit-learn)',
    ],
  },
  {
    category: 'Backend Engineering',
    items: [
      'Python (FastAPI, Django)',
      'Node.js & REST API Design (OpenAPI/Swagger)',
      'Databases (PostgreSQL, MongoDB, Redis, Prisma)',
      'Payments & Auth (Stripe, JWT, OAuth)',
    ],
  },
  {
    category: 'Frontend Engineering',
    items: [
      'React 19 + TypeScript',
      'Vite, Tailwind CSS, Framer Motion',
      'Three.js & Interactive UI',
      'Accessibility & Core Web Vitals',
    ],
  },
  {
    category: 'DevOps & Security',
    items: [
      'Docker, Kubernetes, Drone CI',
      'Linux (Kali, Ubuntu) & Deployment (Coolify, Cloudflare)',
      'Network Security (Suricata, Wireshark, IDS/IPS)',
      'Monitoring & Log Analysis (Elasticsearch)',
    ],
  },
];

/* Testimonials.
 *
 * IMPORTANT: `quote` is intentionally empty. These are real, named people -
 * nothing goes in their mouths that they did not write. The section
 * self-hides until at least MIN_TESTIMONIALS entries have a non-empty quote
 * (see components/Testimonials.tsx), so a half-filled list can never ship.
 *
 * Ask each person for 2-3 sentences on what it was like working with you.
 * [CONFIRM] role + company for each. */
export const testimonials: {
  quote: string;
  name: string;
  role: string;
  company: string;
}[] = [
  { quote: '', name: 'Md. Asif Fiyaz Shoron', role: '', company: '' },
  { quote: '', name: 'Sami Kazi', role: '', company: '' },
  {
    quote: '',
    name: 'Noor-e-Alam Siddiqi',
    role: 'Chief Technology Officer',
    company: 'Summit Towers Limited',
  },
  { quote: '', name: 'Akankha Shikder', role: '', company: '' },
  { quote: '', name: 'Shibli Hossain', role: '', company: '' },
  { quote: '', name: 'Istiaque Ahamed', role: '', company: '' },
];

export const education = [
  {
    degree: 'BSc in Computer Science and Engineering',
    school: 'North South University, Dhaka',
    graduated: 'Apr 2025',
  },
  {
    degree: 'Higher Secondary Certificate, Science',
    school: 'Cambrian College, Dhaka',
    graduated: 'Dec 2018',
  },
  {
    degree: 'Secondary School Certificate, Science',
    school: 'Noakhali Zilla School',
    graduated: 'Jun 2016',
  },
];