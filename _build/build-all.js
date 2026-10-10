// Builds all 12 pages of the site: node _build/build-all.js
const a = require('./pages-a');
const b = require('./pages-b');

[a.home, a.about, a.services, a.skills, a.construction, a.entry,
 b.sectors, b.why, b.careers, b.contact, b.privacy, b.terms, b.notFound].forEach((fn) => fn());
console.log('Built 12 pages + 404');
