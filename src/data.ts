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
  // Closing line in the footer. It replaced an availability pill: the last
  // thing a visitor reads on the way out should be the thesis of the work,
  // not a fourth call to action - `hero.status` already carries availability,
  // and the Contact section carries the ask.
  quote: 'Code — that protects, learns, and evolves.',
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
  headline: ['AI-based products', 'shipped for the', 'real world...'],
  subtitle:
    'I build and ship full-stack AI systems end to end - FastAPI and React, LLM and RAG pipelines, payments, auth, and the deployment around them. Currently leading AI-SaaS engineering at Maktech, and taking on select contract work.',
  status: 'Available for collaborations',
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
    'At **Maktech** I lead AI-SaaS engineering, taking products from a rough brief through architecture, build, and deployment. Alongside that I take on **select contract work** for clients internationally, mostly full-stack AI and SaaS builds.',
    'My core stack is **Python and FastAPI on the backend, React and TypeScript on the front**, with PostgreSQL, Docker, and CI around it. Where a project needs models rather than APIs, I work in PyTorch and TensorFlow - and I care as much about the auth, payment, and deployment layers as the model itself, because that is where products actually break.',
  ],
};

export const services: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'ai-engineering',
    title: 'AI Product Engineering',
    desc: 'End-to-end SaaS builds - FastAPI backends, React front ends, Postgres schemas, auth and payments. Delivered as something you can hand to users, not a prototype that needs a rewrite.',
  },
  {
    icon: 'llm-rag',
    title: 'LLM & RAG Systems',
    desc: 'Retrieval pipelines over your own data using pgvector, ChromaDB, or Pinecone - with evaluation, cost control, and fallbacks, so answers stay grounded instead of confidently wrong.',
  },
  {
    icon: 'backend-api',
    title: 'Backend & API Design',
    desc: 'Typed, documented REST APIs with OpenAPI, sane migrations, and background jobs. Built so the next engineer can read the codebase without a handover call.',
  },
  {
    icon: 'deploy-security',
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
  image: string;
  imageWebp: string;
}[] = [
  {
    icon: 'group-trip',
    title: 'Trubbi - Group Trip Planning',
    desc: 'A group travel planning product built to take the coordination chaos out of planning a trip with friends. Shipped through launch and waitlist onboarding.',
    tags: ['React', 'FastAPI', 'PostgreSQL'],
    url: 'https://www.trubbi.ai/',
    image: '/projects/trubbi.jpg',
    imageWebp: '/projects/trubbi.webp',
  },
  {
    icon: 'deal-radar',
    title: 'Addvanced AI - Deal Hunter',
    desc: 'An AI deal-discovery platform that surfaces and ranks offers automatically, replacing manual comparison with a scored feed.',
    tags: ['Python', 'React', 'LLM'],
    url: 'https://addvancedai.com/',
    image: '/projects/deal-hunter.jpg',
    imageWebp: '/projects/deal-hunter.webp',
  },
  {
    icon: 'ai-model',
    title: 'Elyxa AI',
    desc: 'An AI SaaS platform delivered end to end - product surface, API layer, and deployment, shipped for real users from day one.',
    tags: ['React', 'FastAPI', 'AI'],
    url: 'https://elyxaai.com/',
    image: '/projects/ai-coach.jpg',
    imageWebp: '/projects/ai-coach.webp',
  },
  {
    icon: 'fitness',
    title: 'Peak Physique', // [CONFIRM] renamed from "TrainPeak Physique" - keeping desc/tags/url, confirm they still apply
    desc: 'A fitness and coaching platform covering programme delivery and client management, built to keep coaches and clients in sync.',
    tags: ['Full-Stack', 'Web App'],
    url: 'https://trainpeakphysique.com/', // [CONFIRM] update if the live domain also changed with the rename
    image: '/projects/peak.jpg',
    imageWebp: '/projects/peak.webp',
  },
  {
    icon: 'mortgage-home',
    title: 'Power Play Mortgage', // [CONFIRM] new entry - desc, tags, and url below are placeholders, please replace
    desc: 'A mortgage services platform helping homebuyers compare financing options and move through the application process with less friction.',
    tags: ['Full-Stack', 'Web App'],
    url: '', // [CONFIRM] add live URL
    image: '/projects/mortgage.jpg',
    imageWebp: '/projects/mortgage.webp',
  },
  {
    icon: 'landmark',
    title: '8888 Augusta', // [CONFIRM] renamed from "8888 Masters" - confirm desc/url still match the current site
    desc: 'A dedicated product platform delivered under the Maktech group, covering portfolio, events, and local info end to end.',
    tags: ['Full-Stack', 'Deployment'],
    url: 'https://8888masters.maktechgroups.com/', // [CONFIRM] update if the domain changed along with the rename
    image: '/projects/augusta.jpg',
    imageWebp: '/projects/augusta.webp',
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
      'React 19, Next.js + TypeScript',
      'Vite, Tailwind CSS, Framer Motion',
      'GSAP & Three.js interactive UI',
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
/* ---------------------------------------------------------------------------
 * Industries.
 *
 * The horizontal slider under Services. Each card is one kind of product this
 * practice takes on, not a case study - there is deliberately no link, because
 * a card that looks clickable and is not is worse than one that plainly is not.
 *
 * `image` points at /public/industries/. If the file is absent the card falls
 * back to `tint` and still reads as a designed panel rather than a broken
 * image, which keeps the section shippable while artwork is being sourced.
 *
 * `tint` is a two-stop gradient sampled to sit inside the site palette, so even
 * the fallback state does not look like a placeholder.
 * ------------------------------------------------------------------------- */
export const industries: {
  no: string;
  title: string;
  desc: string;
  image: string;
  tint: string;
}[] = [
  {
    no: '01',
    title: 'Finance SaaS Website',
    desc: 'A premium Framer website designed for a modern fintech startup with a focus on trust, speed, and conversion.',
    image: '/industries/finance-saas.webp',
    tint: 'linear-gradient(135deg, #3A3F47 0%, #14161A 100%)',
  },
  {
    no: '02',
    title: 'AI Automation Platform',
    desc: 'A scalable product website built to simplify complex AI solutions through clear storytelling and intuitive design.',
    image: '/industries/ai-automation.webp',
    tint: 'linear-gradient(135deg, #8A8F96 0%, #2A1512 100%)',
  },
  {
    no: '03',
    title: 'Logistics Company',
    desc: 'A conversion-focused website helping logistics businesses build credibility and attract enterprise clients.',
    image: '/industries/logistics.webp',
    tint: 'linear-gradient(135deg, #6B5750 0%, #1A1416 100%)',
  },
  {
    no: '04',
    title: 'Creative Agency',
    desc: 'A bold agency website featuring immersive interactions, smooth animations, and premium visual storytelling.',
    image: '/industries/creative-agency.webp',
    tint: 'linear-gradient(135deg, #55606A 0%, #16191C 100%)',
  },
  {
    no: '05',
    title: 'Fashion Ecommerce',
    desc: 'An editorial shopping experience crafted to showcase premium products with a clean, modern aesthetic.',
    image: '/industries/fashion-ecommerce.webp',
    tint: 'linear-gradient(135deg, #B4712B 0%, #2A1A0E 100%)',
  },
];

export const iconCredits: {
  required: boolean;
  provider: { name: string; url: string };
  items: { file: string; id: string; label: string; url: string; author: string }[];
} = {
  required: true,
  provider: { name: 'Flaticon', url: 'https://www.flaticon.com/' },
  items: [
    // Services
    { file: 'ai-product-engineering', id: '1693746', label: 'AI Product Engineering', url: 'https://www.flaticon.com/free-icon/ai_1693746', author: 'photo3idea_studio' },
    { file: 'llm-rag-systems', id: '2152343', label: 'LLM & RAG Systems', url: 'https://www.flaticon.com/free-icon/ai_2152343', author: 'Good Ware' },
    { file: 'backend-api-design', id: '8750798', label: 'Backend & API Design', url: 'https://www.flaticon.com/free-icon/web-development_8750798', author: 'Tanah Basah' },
    { file: 'deployment-security', id: '743885', label: 'Deployment & Security', url: 'https://www.flaticon.com/free-icon/cloud-computing_743885', author: 'Freepik' },
    // Selected work
    { file: 'work-trubbi', id: '4807598', label: 'Trubbi', url: 'https://www.flaticon.com/free-icon/diversity_4807598', author: 'Freepik' },
    { file: 'work-addvanced-ai', id: '17772840', label: 'Addvanced AI', url: 'https://www.flaticon.com/free-icon/technological-advancement_17772840', author: 'Freepik' },
    { file: 'work-elyxa-ai', id: '16209773', label: 'Elyxa AI', url: 'https://www.flaticon.com/free-icon/ai-powered-models_16209773', author: 'Freepik' },
    { file: 'work-peak-physique', id: '15837400', label: 'Peak Physique', url: 'https://www.flaticon.com/free-icon/back_15837400', author: 'Freepik' },
    { file: 'work-power-play-mortgage', id: '9651303', label: 'Power Play Mortgage', url: 'https://www.flaticon.com/free-icon/house-rental_9651303', author: 'Freepik' },
    { file: 'work-8888-augusta', id: '3862921', label: '8888 Augusta', url: 'https://www.flaticon.com/free-icon/rua-augusta-arch_3862921', author: 'Freepik' },
    // Toolkit
    { file: 'toolkit-ai-ml', id: '13708311', label: 'AI & Machine Learning', url: 'https://www.flaticon.com/free-icon/technology_13708311', author: 'Freepik' },
    { file: 'toolkit-backend', id: '17234310', label: 'Backend Engineering', url: 'https://www.flaticon.com/free-icon/software_17234310', author: 'Freepik' },
    { file: 'toolkit-frontend', id: '11869427', label: 'Frontend Engineering', url: 'https://www.flaticon.com/free-icon/search-engine_11869427', author: 'Freepik' },
    { file: 'toolkit-devops', id: '12219584', label: 'DevOps & Security', url: 'https://www.flaticon.com/free-icon/settings_12219584', author: 'Freepik' },
  ],
};

export const aliases = [
  'Saif Zaman',
  'Md. Saifuzzaman Naim',
  'Saifuzzaman Naim',
  'Naim',
  'SP4RK',
  'SPARK',
];
