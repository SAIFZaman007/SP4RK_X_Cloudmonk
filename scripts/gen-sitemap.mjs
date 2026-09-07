/**
 * Regenerates dist/sitemap.xml with today's date so lastmod never goes stale.
 *
 * Carries the Google image-sitemap extension as well as the page entry. A
 * single-page site has nothing to gain from a URL list, but it has a lot to
 * gain from telling Google which images belong to it and what they depict:
 * image results are a large share of the traffic a person-name query sends,
 * and an image the crawler has never been pointed at rarely ranks for the name
 * of the person in it.
 *
 * The captions are deliberately name-bearing. They match the alt text in the
 * page and the ImageObject captions in the JSON-LD, so all three agree - which
 * is what makes the association credible rather than looking like stuffing.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ORIGIN = 'https://cloudmonk.cc';
const today = new Date().toISOString().slice(0, 10);

const images = [
  {
    loc: `${ORIGIN}/saif-zaman.jpg`,
    title: 'Saif Zaman (Md. Saifuzzaman Naim) - AI-SaaS Engineer',
    caption:
      'Portrait of Md. Saifuzzaman Naim, known as Saif Zaman and SP4RK, AI-SaaS Engineer in Dhaka, Bangladesh.',
  },
  {
    loc: `${ORIGIN}/preview.webp`,
    title: 'Saif Zaman | AI-SaaS Engineer - portfolio preview',
    caption:
      'Social preview for cloudmonk.cc, the portfolio of Md. Saifuzzaman Naim (Saif Zaman / SP4RK).',
  },
  {
    loc: `${ORIGIN}/logo-mark-512.png`,
    title: 'SP4RK / SZ brand mark',
    caption: 'The SZ dragon monogram used as the SP4RK and Saif Zaman brand mark.',
  },
];

const esc = (v) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const imageXml = images
  .map(
    (img) => `    <image:image>
      <image:loc>${esc(img.loc)}</image:loc>
      <image:title>${esc(img.title)}</image:title>
      <image:caption>${esc(img.caption)}</image:caption>
    </image:image>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${imageXml}
  </url>
</urlset>
`;

writeFileSync(resolve(process.cwd(), 'dist', 'sitemap.xml'), xml);
console.log(`[sitemap] written with lastmod ${today} and ${images.length} image entries`);
