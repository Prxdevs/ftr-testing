// Sectors, Why FTR, Careers, Contact, Privacy, Terms.
const { page } = require('./layout');
const { hero, ctaSection } = require('./ui');
const { arrowImg } = require('./lib');
const { sec, head, team, crumbSchema, icons, sectorImg } = require('./parts');
const { SECTORS, whyTiles } = require('./pages-a');

const ACCESS_KEY = '78b7295d-7517-436d-8d98-2f7b10746d54';

// ---- form helpers ------------------------------------------------------
const fld = (form, id, label, { type = 'text', name = id, req = true, auto = '', opts = null, area = false, help = '', extra = '' } = {}) => {
  const fid = `${form}-${id}`;
  const lab = `<label class="field__label" for="${fid}">${label}${req ? ' <span class="field__req">required</span>' : ''}</label>`;
  let ctl;
  if (opts) {
    ctl = `<select class="field__input" id="${fid}" name="${name}"${req ? ' required' : ''}>
                <option value="">Select one</option>
${opts.map((o) => (Array.isArray(o) ? `                <option value="${o[1]}" data-slug="${o[0]}">${o[1]}</option>` : `                <option value="${o}">${o}</option>`)).join('\n')}
              </select>`;
  } else if (area) {
    ctl = `<textarea class="field__input field__input--area" id="${fid}" name="${name}" rows="6"${req ? ' required' : ''}></textarea>`;
  } else {
    ctl = `<input class="field__input" type="${type}" id="${fid}" name="${name}"${auto ? ` autocomplete="${auto}"` : ''}${req ? ' required' : ''}${extra ? ' ' + extra : ''}>`;
  }
  return `            <div class="field">
              ${lab}
              ${ctl}${help ? `
              <p class="field__help">${help}</p>` : ''}
            </div>`;
};
const row = (a, b) => `            <div class="form__row">
${a}
${b}
            </div>`;

const form = (P, { id, subject, submit = 'Send', success = '', fields, multipart = false }) => `          <form id="${id}" class="form" action="https://api.web3forms.com/submit" method="POST"${multipart ? ' enctype="multipart/form-data"' : ''} data-form data-subject="${subject}"${success ? ` data-success="${success}"` : ''}>
            <input type="hidden" name="access_key" value="${ACCESS_KEY}">
            <input type="hidden" name="subject" value="${subject}">
            <input type="hidden" name="from_name" value="FTR website">
            <div class="form__trap" aria-hidden="true">
              <label for="${id}-trap">Company website</label>
              <input type="text" id="${id}-trap" name="botcheck" tabindex="-1" autocomplete="off">
            </div>

${fields}

            <div class="field field--check">
              <input type="checkbox" id="${id}-consent" name="consent" value="Agreed to Privacy Policy" required>
              <label for="${id}-consent">I agree to FTR using these details to reply, as set out in the <a href="${P}privacy/">Privacy Policy</a>.</label>
            </div>

            <div class="form__actions">
              <button class="btn btn--primary" type="submit">${submit}</button>
            </div>

            <p class="form__status" role="status" aria-live="polite"></p>
          </form>`;

// ---------------------------------------------------------------- Sectors
function sectors() {
  const links = {
    semiconductor: [['Critical Construction', 'services/critical-construction/'], ['Skills Development', 'services/skills-development/'], ['India Market Entry', 'services/india-market-entry/']],
  };
  const dflt = [['Critical Construction', 'services/critical-construction/'], ['Skills Development', 'services/skills-development/']];
  page({
    slug: 'sectors',
    title: 'Sectors We Serve &mdash; Fabs, Data Centres, Cleanrooms | FTR',
    desc: 'FTR serves semiconductor fabs, ATMP/OSAT units, hyperscale data centres, pharma cleanrooms, EV/battery gigafactories and green hydrogen facilities in India.',
    schema: [crumbSchema([['Home', ''], ['Sectors', 'sectors/']])],
    body: (P) => `
${hero({ P, label: 'Sectors', title: 'Sectors we serve.', lede: 'Six facility classes. Each links to the services that apply.', photo: 'data-hall', short: true })}

${sec({ id: 'six', num: '01', label: 'Six facility classes', body: `      <ul class="cards3">
${SECTORS.map(([id, ic, name, role], i) => `        <li class="card3 card3--static card3--photo reveal" id="${id}">
          <div class="card3__box">
            <div class="card3__photo">${sectorImg(P, id)}</div>
            <div class="card3__body">
            ${icons[ic]}
            <span class="card3__num">0${i + 1}</span>
            <h2 class="card3__title">${name}</h2>
            <p class="card3__text">${role}</p>
            <p class="card3__links">${(links[id] || dflt).map(([t, h]) => `<a class="link" href="${P}${h}">${t} ${arrowImg(P)}</a>`).join('')}</p>
            </div>
          </div>
        </li>`).join('\n')}
      </ul>` })}

${ctaSection(P, {}, '', ' on-navy')}
`,
  });
}

// ---------------------------------------------------------------- Why FTR
function why() {
  page({
    slug: 'why-ftr',
    title: 'Why FTR &mdash; Right First Time, Irish Standards',
    desc: 'Four reasons to choose FTR: quality planned from day one, Irish and European standards, a workforce built in, and one partner end to end.',
    schema: [crumbSchema([['Home', ''], ['Why FTR', 'why-ftr/']])],
    body: (P) => `
${hero({ P, label: 'Why FTR', title: 'Four reasons to choose FTR.', lede: 'Quality and delivery, planned from day one.', photo: 'distribution-board', short: true })}

${sec({ id: 'four', num: '01', label: 'Four differentiators', body: `${head('What sets FTR apart.')}
${whyTiles(P)}` })}

  <!-- SIX AREAS BLOCK (not published): "Where general M&E practice does not transfer" —
       six characteristics of the mission-critical facility class. Text to follow from FTR;
       add a section here when supplied. -->

${sec({ id: 'proof', tone: 'on-paper', num: '02', label: 'Proof', body: `${head('Proof is in the people.', 'Paul Colleary brings 30+ years of mission-critical M&amp;E delivery across Europe. The team is Irish, European and Indian, with projects delivered across Europe.')}
${team(P, false)}` })}

${ctaSection(P, {}, '', ' on-navy')}
`,
  });
}

// ---------------------------------------------------------------- Careers
function careers() {
  const TRADES = ['Process and utility piping', 'Electrical', 'HVAC', 'Cleanroom fit-out', 'Commissioning'];
  const train = form('', {
    id: 'form-train', subject: 'Careers: Train with FTR', submit: 'Register interest',
    fields: [
      row(fld('train', 'name', 'Name', { auto: 'name' }), fld('train', 'phone', 'Phone', { type: 'tel', auto: 'tel' })),
      row(fld('train', 'email', 'Email', { type: 'email', auto: 'email' }), fld('train', 'state', 'State', { auto: 'address-level1' })),
      row(fld('train', 'qualification', 'Qualification', { opts: ['ITI pass-out', 'Diploma holder', 'B.E./B.Tech graduate', 'Experienced site worker', 'Other'] }),
        fld('train', 'trade', 'Trade of interest', { opts: TRADES })),
      fld('train', 'experience', 'Years of site experience', { type: 'number', extra: 'min="0" max="60" inputmode="numeric"' }),
    ].join('\n'),
  });
  const trainer = form('', {
    id: 'form-trainer', subject: 'Careers: Become a trainer', submit: 'Send application', multipart: true,
    fields: [
      row(fld('trainer', 'name', 'Name', { auto: 'name' }), fld('trainer', 'email', 'Email', { type: 'email', auto: 'email' })),
      row(fld('trainer', 'country', 'Country', { auto: 'country-name' }), fld('trainer', 'trade', 'Trade', { opts: TRADES })),
      row(fld('trainer', 'years', 'Years in mission-critical', { type: 'number', extra: 'min="0" max="60" inputmode="numeric"' }),
        fld('trainer', 'linkedin', 'LinkedIn', { type: 'url', req: false })),
      fld('trainer', 'cv', 'CV upload', { type: 'file', name: 'attachment', extra: 'accept=".pdf,.doc,.docx"', help: 'PDF or Word.' }),
    ].join('\n'),
  });
  const partner = form('', {
    id: 'form-partner', subject: 'Careers: Partner with us', submit: 'Send enquiry',
    fields: [
      row(fld('partner', 'organisation', 'Organisation', { auto: 'organization' }), fld('partner', 'contact', 'Contact name', { auto: 'name' })),
      row(fld('partner', 'role', 'Role', { auto: 'organization-title' }), fld('partner', 'email', 'Email', { type: 'email', auto: 'email' })),
      row(fld('partner', 'phone', 'Phone', { type: 'tel', auto: 'tel' }),
        fld('partner', 'type', 'Partnership type', { name: 'partnership_type', opts: ['Government skilling body', 'University or institution', 'Contractor workforce upskilling', 'Other'] })),
    ].join('\n'),
  });
  // `form()` was called without P so the privacy link needs the page depth: fix it up.
  const fix = (s) => s.replace('href="privacy/"', 'href="../privacy/"');

  page({
    slug: 'careers',
    title: 'Careers &amp; Trainee Enrolment &mdash; FTR',
    desc: 'Train with FTR, become a trainer, or partner with us. Enrol in M&amp;E and cleanroom certification, or apply as a master trainer or institutional partner.',
    css: ['contact'],
    schema: [crumbSchema([['Home', ''], ['Careers', 'careers/']])],
    body: (P) => `
${hero({ P, label: 'Careers', title: 'Train with us, teach with us, or partner with us.', lede: 'One page, three routes. Choose yours below.', short: true, photo: 'panel-technician' })}

${sec({ id: 'routes', num: '01', label: 'Choose your route', body: `      <div class="tabs">
        <div class="tabs__list" role="tablist" aria-label="Careers routes">
          <button class="tabs__tab" role="tab" type="button" id="tab-train" aria-controls="train">Train with FTR</button>
          <button class="tabs__tab" role="tab" type="button" id="tab-trainer" aria-controls="trainer">Become a trainer</button>
          <button class="tabs__tab" role="tab" type="button" id="tab-partner" aria-controls="partner">Partner with us</button>
        </div>

        <div class="tabs__panel" id="train" role="tabpanel" aria-labelledby="tab-train">
          <div class="tabs__intro">
            <h2 class="h2">Train with FTR</h2>
            <p>For ITI pass-outs, diploma holders, B.E./B.Tech graduates and experienced site workers. Trades: process and utility piping, electrical, HVAC, cleanroom fit-out and commissioning, across three certification tiers. Every entrant completes the mandatory Cleanroom Construction Fundamentals and EHS Safe-Site Pass foundation.</p>
          </div>
${fix(train.replace('href=""', 'href=""'))}
        </div>

        <div class="tabs__panel" id="trainer" role="tabpanel" aria-labelledby="tab-trainer">
          <div class="tabs__intro">
            <h2 class="h2">Become a trainer</h2>
            <p>For experienced Irish/European and Indian M&amp;E professionals. Master trainer and train-the-trainer roles.</p>
          </div>
${fix(trainer)}
        </div>

        <div class="tabs__panel" id="partner" role="tabpanel" aria-labelledby="tab-partner">
          <div class="tabs__intro">
            <h2 class="h2">Partner with us</h2>
            <p>For government skilling bodies, universities and contractors. A hub-and-spoke model with government-owned institutions, and workforce upskilling for contractors.</p>
          </div>
${fix(partner)}
        </div>
      </div>` })}
`,
  });
}

// ---------------------------------------------------------------- Contact
function contact() {
  const f = form('', {
    id: 'enquiry', subject: 'FTR website enquiry', submit: 'Send enquiry',
    fields: [
      row(fld('c', 'name', 'Name', { name: 'name', auto: 'name' }), fld('c', 'company', 'Company', { name: 'company', auto: 'organization' })),
      row(fld('c', 'role', 'Role', { name: 'role', auto: 'organization-title' }), fld('c', 'email', 'Email', { type: 'email', name: 'email', auto: 'email' })),
      row(fld('c', 'phone', 'Phone (with country code)', { type: 'tel', name: 'phone', auto: 'tel', req: false }), fld('c', 'country', 'Country', { name: 'country', auto: 'country-name' })),
      fld('c', 'type', 'Enquiry type', { name: 'enquiry_type', opts: [
        ['skills-development', 'Skills Development'],
        ['critical-construction', 'Critical Construction &amp; Consultancy'],
        ['india-market-entry', 'India Market Entry'],
        ['careers', 'Careers'],
        ['other', 'Other'],
      ] }),
      fld('c', 'message', 'Message', { name: 'message', area: true }),
    ].join('\n'),
  }).replace('href=""', 'href=""').replace('href="privacy/"', 'href="../privacy/"');

  page({
    slug: 'contact',
    title: 'Contact FTR &mdash; Discuss Your Project',
    desc: 'Contact FTR about skills development, critical construction and consultancy, India market entry or careers. Email general@ftright.com or use the form.',
    css: ['contact'],
    schema: [crumbSchema([['Home', ''], ['Contact', 'contact/']])],
    body: (P) => `
${hero({ P, label: 'Contact', title: 'Let&rsquo;s build it right first time.', lede: 'Tell us about the facility, the programme and the constraint.', short: true, photo: 'data-hall' })}

${sec({ id: 'form', num: '01', label: 'Send an enquiry', body: `      <div class="grid contact">
        <div class="contact__form">
${f}
        </div>
        <aside class="contact__aside" aria-label="Contact details">
          <h2 class="aside__title h4">Email</h2>
          <p class="person-card__mail"><a class="aside__mail" href="mailto:general@ftright.com">general@ftright.com</a></p>
          <h2 class="aside__title aside__title--spaced h4">Locations</h2>
          <p class="person-card__mail">India</p>
        </aside>
      </div>` })}
`,
  });
}

// ---------------------------------------------------------------- Legal
const legal = (slug, title, desc, h1, updated, sections) => page({
  slug, title, desc, noindex: false,
  schema: [crumbSchema([['Home', ''], [h1, slug + '/']])],
  body: (P) => `
${hero({ P, label: 'Legal', title: h1, lede: updated, short: true })}

  <section class="section" aria-label="${h1}">
    <div class="shell">
      <div class="legal">
${sections.map(([h, ...ps]) => `        <h2>${h}</h2>\n${ps.map((p) => (p.startsWith('<ul') ? p : `        <p>${p}</p>`)).join('\n')}`).join('\n')}
      </div>
    </div>
  </section>
`,
});

function privacy() {
  const E = '<a href="mailto:general@ftright.com">general@ftright.com</a>';
  legal('privacy', 'Privacy Policy &mdash; FTR', 'How FTR collects, uses and protects personal data, under India&rsquo;s Digital Personal Data Protection Act 2023, the IT Act 2000 and, for EU visitors, the GDPR.',
    'Privacy Policy', 'Last updated: October 2026.', [
      ['Who we are', 'This website is operated by Ftright Tech-Infra &amp; Solutions Private Limited (&ldquo;FTR&rdquo;, &ldquo;First Time Right&rdquo;), CIN U42909GJ2026PTC181309. For privacy questions, write to ' + E + '.'],
      ['What we collect', 'Only what you give us through our forms: your name, contact details, organisation, role, country, the content of your message and, for careers enquiries, details such as qualification, trade, experience and a CV you choose to upload.'],
      ['Why we use it', 'To reply to your enquiry, to assess trainee, trainer and partner applications, and to run our business. We do not sell personal data and we do not add you to a mailing list because you wrote to us.'],
      ['Who processes it', 'Form submissions are delivered to FTR by a third-party form service, Web3Forms, and read by FTR staff. Our email runs on Google Workspace. These providers act on our instructions.'],
      ['Cookies and analytics', 'Analytics cookies are set only after you consent through the cookie banner. If you decline, none are set. Strictly necessary storage, such as remembering your choice, does not need consent.'],
      ['Your rights in India', 'Under the Digital Personal Data Protection Act 2023 you may ask to access, correct or erase your personal data, withdraw consent, and nominate someone to exercise these rights for you. We handle personal data in line with the Information Technology Act 2000 and its rules.'],
      ['Your rights if you are in the EU or UK', 'Under the GDPR you also have the right to object to or restrict processing and to data portability, and to complain to your local data protection authority. Our legal bases are your consent and our legitimate interest in responding to enquiries.'],
      ['Keeping data', 'We keep personal data only as long as needed for the purpose it was given, or as the law requires, and then delete it.'],
      ['Exercising your rights', 'Email ' + E + ' and we will respond within a reasonable time.'],
      ['Changes', 'We may update this policy. The date at the top shows when it last changed.'],
    ]);
}

function terms() {
  legal('terms', 'Terms of Use &mdash; FTR', 'Terms of use for the FTR website. Governed by the Indian Contract Act 1872; website content is not an offer.',
    'Terms of Use', 'Last updated: October 2026.', [
      ['Acceptance', 'By using this website you agree to these terms. The site is operated by Ftright Tech-Infra &amp; Solutions Private Limited (&ldquo;FTR&rdquo;).'],
      ['No offer', 'Information on this website is general. It is not an offer, quotation or contract. Any engagement with FTR is made only through a written agreement signed by both parties.'],
      ['Accuracy', 'We take care to keep the content accurate and current, but give no warranty that it is complete or up to date. Statistics are attributed to their sources.'],
      ['Intellectual property', 'The content, name and logo are owned by FTR or used with permission. You may view and share pages for personal or internal business use, but may not copy, alter or republish them commercially without written permission.'],
      ['Acceptable use', 'Do not misuse the site, attempt to disrupt it or gain unauthorised access, or submit unlawful, false or harmful content through our forms.'],
      ['Links and third parties', 'Links to other websites are provided for convenience. We are not responsible for their content or practices.'],
      ['Limitation of liability', 'To the extent permitted by law, FTR is not liable for loss arising from your use of, or reliance on, this website.'],
      ['Governing law', 'These terms are governed by the laws of India, including the Indian Contract Act 1872.'],
      ['Contact', 'Questions about these terms: <a href="mailto:general@ftright.com">general@ftright.com</a>.'],
    ]);
}

// ---------------------------------------------------------------- 404
function notFound() {
  page({
    slug: '', file: '404.html', root: true, noindex: true,
    title: 'Page not found &mdash; FTR',
    desc: 'This page does not exist. Return to the FTR home page or contact general@ftright.com.',
    body: (P) => `
${hero({ P, label: 'Page not found', title: 'That page is not here.', lede: 'The link may be old. Start from the home page, or write to general@ftright.com.', short: true, photo: 'pipe-runs' })}

${sec({ id: 'back', num: '01', label: 'Where to next', body: `${head('Pick up from here.')}
      <p class="stat__src"><a class="link" href="/">Home ${arrowImg(P)}</a> &nbsp; <a class="link" href="/services/">Services ${arrowImg(P)}</a> &nbsp; <a class="link" href="/contact/">Contact ${arrowImg(P)}</a></p>` })}
`,
  });
}

module.exports = { sectors, why, careers, contact, privacy, terms, notFound };
