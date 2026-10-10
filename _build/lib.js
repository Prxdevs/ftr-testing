// Shared helpers for the page builders. Run a builder with: node _build/build-sector.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Plain-language definitions, written by us (not taken from the client's decks).
// Every one needs client sign-off before launch.
const GLOSSARY = {
  hepa: ['HEPA', 'A very fine air filter that traps almost every airborne particle. It is why a cleanroom stays clean.'],
  iso14644: ['ISO 14644', 'The international standard that grades how clean the air in a cleanroom has to be.'],
  esd: ['ESD', 'Electrostatic discharge: a tiny static spark that can destroy a microchip.'],
  diffpressure: ['differential pressure', 'Keeping the cleaner room at slightly higher air pressure, so dirty air can never drift in.'],
  diwater: ['DI water', 'Deionised water: water stripped of minerals so nothing in it can contaminate a chip.'],
  atmp: ['ATMP', 'Assembly, testing, marking and packaging: the factory step after chips are made.'],
  osat: ['OSAT', 'Outsourced assembly and test: a plant that finishes and checks chips made elsewhere.'],
  ism: ['ISM', 'The India Semiconductor Mission: the government programme backing India’s chip plants.'],
  n1: ['N+1', 'A backup design with one spare unit beyond what the load needs, so one failure changes nothing.'],
  twoN: ['2N', 'A backup design with a complete second system, so a whole side can fail and the hall stays on.'],
  ups: ['UPS', 'Uninterruptible power supply: batteries that carry the load for the seconds before generators start.'],
  crah: ['CRAH/CRAC', 'The cooling units that chill the air in a data hall.'],
  bms: ['BMS/SCADA', 'Control software that monitors and runs a building’s equipment from one place.'],
  ist: ['integrated systems testing', 'Deliberately causing failures, such as a power cut or lost cooling, to prove everything responds as designed.'],
  ce: ['cause-and-effect', 'A matrix proving that every possible fault triggers the right response.'],
  gmp: ['GMP', 'Good Manufacturing Practice: the rules that make medicines safe to produce.'],
  iqoqpq: ['IQ/OQ/PQ', 'Three documented checks: installed correctly, operates correctly, performs correctly over time.'],
  holdpoint: ['hold point', 'A mandatory stop: work cannot continue until a named person signs it off in writing.'],
  itp: ['ITP', 'Inspection and test plan: the written schedule of what gets checked, when and by whom.'],
  ncr: ['non-conformance', 'A formal record that something does not meet specification.'],
  p6: ['Primavera P6', 'The industry-standard software for building and tracking a construction programme.'],
  mep: ['M&E', 'Mechanical and electrical: the working systems of a building, such as power, cooling and piping.'],
  epc: ['EPC', 'Engineering, procurement and construction: one contractor responsible for designing and building a facility.'],
  commissioning: ['commissioning', 'Proving a finished facility actually works as designed before it is handed over.'],
};

const term = (key, label) => {
  const g = GLOSSARY[key];
  if (!g) throw new Error('unknown glossary term: ' + key);
  return `<span class="term-wrap"><button class="term" type="button" aria-expanded="false">${label || g[0]}</button><span class="term__def" role="note">${g[1]}</span></span>`;
};

// Link arrow: a drawn monoline arrow that takes the link's own colour (copper), so it
// belongs to the palette. The logo artwork is left alone and used only as the logo.
const arrowImg = (P, cls = 'link__arrow') => `<svg class="${cls}" viewBox="0 0 16 11" width="16" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M1 5.5h13.5M10 1l4.5 4.5L10 10"/></svg>`;

// Alt text for the stock photography. It describes what is pictured and never implies
// that FTR built it.
const ALT = {
  'gmp-isolator': 'Operators in cleanroom gowns at a stainless-steel isolator line',
  'fire-main': 'Engineer in high-visibility clothing inspecting pipework in a plant room',
  'pipe-runs': 'Insulated pipe runs and cable tray in a services corridor',
  'welding-training': 'Two welders in helmets working at a bench',
  'switchgear-hall': 'A row of electrical switchgear panels in a plant hall',
  'hero-cranes': 'Tower cranes over a large building under construction',
  'plant-exterior': 'Industrial plant exterior with stacks and steel platforms',
  'data-hall': 'Server cabinets in a data hall',
  'process-valves': 'Stainless-steel process pipework, valves and pumps',
  'panel-technician': 'Technician testing an electrical panel with a multimeter',
  'cable-containment': 'Insulated ductwork running overhead',
  'distribution-board': 'Circuit breakers in a distribution board',
  'sector-semiconductor': 'Gowned technician in a white cleanroom corridor',
  'sector-data-centres': 'Server cabinets in a data hall',
  'sector-pharma': 'Gowned operator at a pharmaceutical cleanroom isolator',
};
const alt = (name) => ALT[name] || '';
const link = (P, href, text) => `<a class="link" href="${href}">${text} ${arrowImg(P)}</a>`;

const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&rsquo;/g, '’').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

const faq = (items) => `<div class="faq">
${items.map(([q, a]) => `        <details class="faq__item"><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
      </div>`;

const faqSchema = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: plain(q), acceptedAnswer: { '@type': 'Answer', text: plain(a) } })),
});

const next = (P, href, label, title) => `<a class="next reveal" href="${href}">
        <span class="next__label">${label}</span>
        <span class="next__title">${title} ${arrowImg(P)}</span>
      </a>`;

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const write = (rel, s) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, s);
};

// Client brief: NO physical address anywhere; contact is general@ftright.com; legal name in
// Title Case; LinkedIn URL to follow (add to sameAs when supplied).
const organization = {
  '@type': 'Organization', '@id': 'https://ftright.com/#organization',
  name: 'FTR', alternateName: 'First Time Right', legalName: 'Ftright Tech-Infra & Solutions Private Limited',
  url: 'https://ftright.com/', logo: 'https://ftright.com/assets/img/ftr-logo-64.png',
  areaServed: { '@type': 'Country', name: 'India' },
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', email: 'general@ftright.com' }],
};

module.exports = { ROOT, GLOSSARY, term, link, arrowImg, alt, plain, faq, faqSchema, next, read, write, organization };
