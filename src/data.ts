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
  brand: 'SP4RK',
  quote: 'Code — that protects, learns, and evolves.',
  role: 'AI-SaaS Engineer',
  title: 'Saif Zaman | AI-SaaS Engineer - Full-Stack, ML & Secure Systems',
  description:
    'AI-SaaS engineer in Dhaka, Bangladesh. I ship production AI products end to end - FastAPI and React systems, LLM and RAG pipelines, payments, and the infrastructure they run on. Currently working full-time at Maktech, dedicated to building scalable solutions that solve real product needs.',
  url: 'https://cloudmonk.cc',
  email: 'spark@cloudmonk.cc',
  cvLink: '/media/Saif_Zaman_CV.pdf',
  linkedin: 'https://www.linkedin.com/in/saifzaman',
  github: 'https://github.com/SAIFZaman007',
};

export const hero = {
  eyebrow: 'AI-SaaS Engineer - Dhaka, BD',
  headline: ['AI-based products', 'shipped for the', 'real world...'],
  tagline: 'Helping ambitious brands launch faster...',
  subtitle:
    'I build AI-powered, intelligent, industry-standard, enterprise leaning systems that move products from concept to market; with the engineering to scale beyond it.',

  status: {
    lead: 'Orchestrating the future @',
    link: { label: 'Maktech', href: 'https://maktechgroup.com/' },
  },
  stats: [
    { number: 20, suffix: '+', label: 'products shipped live' },
    { number: 7, suffix: '+', label: 'yrs writing code' },
    { number: 24, suffix: 'h', label: 'response time' },
  ],

  stack: ['Python', 'FastAPI', 'React', 'Next.JS', 'PostgreSQL', 'Docker', 'PyTorch', 'Redis', 'Stripe'],
};

export const about = {
  image: '/saif-zaman.jpg',
  imageWebp: '/saif-zaman.webp',
  quickFacts: [
    { label: 'Based in', value: 'Dhaka, Bangladesh' },
    { label: 'Role', value: 'AI-SaaS Engineer' },
    {
      label: 'Current focus',
      value: { text: 'Maktech', href: 'https://www.maktechgroup.com' },
    },
    { label: 'Response time', value: 'Within 24 hours' },
  ],
  paragraphs: [
    "I'm an AI-SaaS engineer in Dhaka. My work sits where machine learning, software engineering, and security collide. I build systems that are precise, **hold up under real traffic**, and stay secure while doing it.",
    'At [Maktech](https://www.maktechgroup.com) I lead AI-SaaS engineering, taking products from a rough brief through architecture, build, and deployment. I work for clients internationally, mostly full-stack AI and SaaS builds.',
    'My core stack is **Python and FastAPI on the backend, React/Next and TypeScript on the front**, with PostgreSQL, Docker, and CI around it. Where a project needs models rather than APIs, I work in PyTorch and TensorFlow - and I care as much about the auth, payment, and deployment layers as the model itself, because that is where products actually break.',
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
    title: 'Peak Physique',
    desc: 'A fitness and coaching platform covering programme delivery and client management, built to keep coaches and clients in sync.',
    tags: ['Full-Stack', 'Web App'],
    url: 'https://trainpeakphysique.com/',
    image: '/projects/peak.jpg',
    imageWebp: '/projects/peak.webp',
  },
  {
    icon: 'mortgage-home',
    title: 'Power Play Mortgage',
    desc: 'A mortgage services platform helping homebuyers compare financing options and move through the application process with less friction.',
    tags: ['Full-Stack', 'Web App'],
    url: 'https://powerplaymortgage.net/',
    image: '/projects/mortgage.jpg',
    imageWebp: '/projects/mortgage.webp',
  },
  {
    icon: 'landmark',
    title: '8888 Augusta',
    desc: 'A single curated portfolio of homes near Augusta National. Booked direct, hosted in person, with access and proximity no marketplace can offer.',
    tags: ['Full-Stack', 'Deployment'],
    url: 'https://8888augusta.com/',
    image: '/projects/augusta.jpg',
    imageWebp: '/projects/augusta.webp',
  },
];

export const experience = [
  {
    role: 'AI-SaaS Engineer',
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
    desc: 'Designing high-performance websites for modern fintech startups, engineered for absolute reliability, lightning speed, and effortless user control.',
    image: '/industries/finance-saas.webp',
    tint: 'linear-gradient(135deg, #3A3F47 0%, #14161A 100%)',
  },
  {
    no: '02',
    title: 'AI Automation Platform',
    desc: 'Building scalable, intuitive web platforms that demystify complex AI/ML technologies through clear messaging and seamless user flows.',
    image: '/industries/ai-automation.webp',
    tint: 'linear-gradient(135deg, #8A8F96 0%, #2A1512 100%)',
  },
  {
    no: '03',
    title: 'Logistics Company',
    desc: 'Creating conversion-focused digital experiences designed to position logistics brands for enterprise-level client acquisition.',
    image: '/industries/logistics.webp',
    tint: 'linear-gradient(135deg, #6B5750 0%, #1A1416 100%)',
  },
  {
    no: '04',
    title: 'Creative Agency',
    desc: 'Architecting bold, immersive agency websites featuring fluid animations, interactive storytelling, and high-impact visual design.',
    image: '/industries/creative-agency.webp',
    tint: 'linear-gradient(135deg, #55606A 0%, #16191C 100%)',
  },
  {
    no: '05',
    title: 'Fashion Ecommerce',
    desc: 'Structuring editorial-grade shopping experiences crafted to showcase luxury products through a refined, modern visual aesthetic.',
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
    {
      file: 'ai-product-engineering',
      id: '1693746',
      label: 'AI Product Engineering',
      url: 'https://www.flaticon.com/free-icon/ai_1693746',
      author: 'photo3idea_studio'
    },
    {
      file: 'llm-rag-systems',
      id: '2152343',
      label: 'LLM & RAG Systems',
      url: 'https://www.flaticon.com/free-icon/ai_2152343',
      author: 'Good Ware'
    },
    {
      file: 'backend-api-design',
      id: '8750798',
      label: 'Backend & API Design',
      url: 'https://www.flaticon.com/free-icon/web-development_8750798',
      author: 'Tanah Basah'
    },
    {
      file: 'deployment-security',
      id: '743885',
      label: 'Deployment & Security',
      url: 'https://www.flaticon.com/free-icon/cloud-computing_743885',
      author: 'Freepik'
    },
    // Selected work
    {
      file: 'work-trubbi',
      id: '4807598',
      label: 'Trubbi',
      url: 'https://www.flaticon.com/free-icon/diversity_4807598',
      author: 'Freepik'
    },
    {
      file: 'work-addvanced-ai',
      id: '17772840',
      label: 'Addvanced AI',
      url: 'https://www.flaticon.com/free-icon/technological-advancement_17772840',
      author: 'Freepik'
    },
    {
      file: 'work-elyxa-ai',
      id: '16209773',
      label: 'Elyxa AI',
      url: 'https://www.flaticon.com/free-icon/ai-powered-models_16209773',
      author: 'Freepik'
    },
    {
      file: 'work-peak-physique',
      id: '15837400',
      label: 'Peak Physique',
      url: 'https://www.flaticon.com/free-icon/back_15837400',
      author: 'Freepik'
    },
    {
      file: 'work-power-play-mortgage',
      id: '9651303',
      label: 'Power Play Mortgage',
      url: 'https://www.flaticon.com/free-icon/house-rental_9651303',
      author: 'Freepik'
    },
    {
      file: 'work-8888-augusta',
      id: '3862921',
      label: '8888 Augusta',
      url: 'https://www.flaticon.com/free-icon/rua-augusta-arch_3862921',
      author: 'Freepik'
    },
    // Toolkit
    {
      file: 'toolkit-ai-ml',
      id: '13708311',
      label: 'AI & Machine Learning',
      url: 'https://www.flaticon.com/free-icon/technology_13708311',
      author: 'Freepik'
    },
    {
      file: 'toolkit-backend',
      id: '17234310',
      label: 'Backend Engineering',
      url: 'https://www.flaticon.com/free-icon/software_17234310',
      author: 'Freepik'
    },
    {
      file: 'toolkit-frontend',
      id: '11869427',
      label: 'Frontend Engineering',
      url: 'https://www.flaticon.com/free-icon/search-engine_11869427',
      author: 'Freepik'
    },
    {
      file: 'toolkit-devops',
      id: '12219584',
      label: 'DevOps & Security',
      url: 'https://www.flaticon.com/free-icon/settings_12219584',
      author: 'Freepik'
    },
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
