import { expandedArticles } from '/blog-content.js';

const posts = [
  ['why-most-business-automation-fails', 'Why Most Business Automation Fails (And How to Fix It)', 'Automation strategy', 'Buying a new AI chatbot rarely solves operational confusion. Diagnose how work moves first, then design, prove, and reuse the smallest system that fixes the bottleneck.', [['Diagnose', 'Locate the exact operational bottleneck before choosing software or writing code.'], ['Design', 'Plan the simplest maintainable system with clear internal ownership.'], ['Prove', 'Verify execution against pre-agreed acceptance criteria.'], ['Reuse', 'Turn successful workflows into playbooks as the team scales.']], ['Buying a new AI chatbot or adding another SaaS subscription rarely solves operational confusion. If the underlying business process is disorganized, automation simply speeds up the disorganization.', 'Most AI projects become shelfware because teams attempt to automate surface symptoms rather than diagnosing structural process leaks. At Mobile Lab, we follow a strict four-step method to ensure systems stick.', 'Before investing in new software, fix how work moves.']],
  ['hidden-cost-spreadsheet-operations', 'The Hidden Cost of “Spreadsheet Operations”', 'Operations', 'When the same facts are retyped across spreadsheets, group chats, and email threads, profit margins leak quietly through errors, status friction, and disconnected data.', [['Human error', 'Repeated typing guarantees information drift and costly mistakes.'], ['Status friction', 'Teams ask for updates instead of viewing a single source of truth.'], ['Data disconnect', 'Reporting gets delayed while back-office records are reconciled manually.']], ['When the same facts are retyped across spreadsheets, group chats, and email threads, profit margins leak quietly.', 'Manual data re-entry creates operational drag in three distinct ways: typing order details or booking notes multiple times guarantees information drift; employees spend hours asking for status updates instead of viewing a source of truth; and reporting gets delayed while back-office records are reconciled manually from multiple sheets.', 'Moving away from spreadsheet chaos does not require replacing every tool at once. Start by identifying repeated jobs such as order intake, dispatch, or invoice processing, then put them into a structured workflow the team can reliably operate.']],
  ['stopping-pipeline-leakage', 'Stopping Pipeline Leakage in Customer Acquisition', 'Revenue systems', 'Marketing effort is wasted when inbound interest sits unaddressed in social DMs, website forms, and inbox silos.', [['Instant capture', 'Every inquiry lands in one operational queue.'], ['Automated qualification', 'Standard criteria filter serious prospects before handoff.'], ['Pipeline sync', 'Qualified leads create customer records and trigger follow-ups automatically.']], ['Marketing effort is wasted when inbound interest sits unaddressed in social media DMs, website forms, and inbox silos.', 'Pipeline leakage occurs when customer acquisition tools are disconnected from daily operations. When a prospect submits an inquiry, every hour of delay reduces response and qualification rates.', 'An effective AI Customer and Revenue System unifies web chat, social messaging, and forms into a single queue, qualifies serious prospects against standard criteria, and creates customer records without manual copy-pasting.']],
  ['ai-automation-audit', 'The AI & Automation Audit: Finding the Right Problem', 'Audits', 'The most expensive software mistake is solving the wrong problem with high precision. An audit locates the bottleneck before code or software selection.', [['Map the work', 'See how work and data move across the team and tools.'], ['Find the friction', 'Identify handoffs that create error, delay, or rework.'], ['Build only what is needed', 'Choose the smallest architecture that fixes the specific leak.']], ['The most expensive software mistake a business can make is solving the wrong problem with high precision.', 'When operations slow down, the instinct is often to buy a subscription or hire more staff. The loudest symptom, such as delayed client delivery, is rarely the root cause.', 'An AI and Automation Audit evaluates how work moves, where manual handoffs create friction, error, or delay, and the simplest architecture required to fix the bottleneck. Diagnosing first gives the business a clear plan to build only what is necessary.']],
  ['quality-assurance-loops', 'Quality Assurance Loops in Automated Workflows', 'Reliability', 'Reliable automation does not remove human judgment. It prepares drafts and gathers data while keeping humans at critical approval gates.', [['Data verification', 'Cross-reference information against official sources of truth.'], ['Review gates', 'Route drafts, quotes, and communications through approval.'], ['Exception alerts', 'Flag records outside normal parameters for manual review.']], ['Deploying generative AI directly to public or client-facing channels without human oversight creates brand risk and costly rework.', 'Reliable automation uses AI for draft preparation and data gathering while keeping humans at critical approval gates. Structural validation loops cross-check information, route generated work through approval, and flag exceptions for immediate review.', 'Explicit review gates deliver speed without sacrificing accuracy or control.']],
  ['operator-dashboards', 'Operator Dashboards vs. Decorative Analytics', 'Decision systems', 'A useful dashboard ties every displayed number to an operational record and helps an owner make a decision today.', [['Source traceability', 'Click from a metric to its source row or customer record.'], ['Decision relevance', 'Track bottlenecks, approvals, and unassigned work.'], ['Exception management', 'Highlight stalled workflows instead of static summaries.'], ['Single source of truth', 'Unify sales, inventory, and fulfillment into one view.']], ['Most business dashboards are filled with decorative charts that look impressive but fail to help owners make daily decisions.', 'An effective operator dashboard provides visibility by tying every number directly to an operational record. Every metric should lead to its source row or customer record, track an immediate decision, and highlight exceptions or stalled workflows.', 'Unify sales, inventory, and fulfillment into one operational view so analytics becomes an active decision tool rather than a static report.']],
  ['when-saas-falls-short', 'When Off-the-Shelf SaaS Falls Short', 'Custom software', 'Subscription software is convenient until operations bend around rigid limitations, bloated costs, data silos, and complex workarounds.', [['Custom workflows', 'Build internal tools, portals, or dispatch boards around the real process.'], ['Data ownership', 'Keep core operational data in a unified system.'], ['Targeted architecture', 'Pay for the exact capabilities the business requires.']], ['Subscription software is convenient until a business is forced to bend around rigid limitations. As companies scale, stacked SaaS platforms often create bloated costs, disconnected data silos, and complex workarounds.', 'Custom Business Software is appropriate when off-the-shelf tools can no longer hold a unique process: build tools around the real operation, keep core data unified, and eliminate features the business does not need.', 'When generic software creates more work than it saves, build custom tools fitted to how the business actually runs.']],
  ['long-term-system-adoption', 'Ensuring Long-Term System Adoption', 'Adoption', 'Projects fail after launch when teams lack clear ownership and operational playbooks. Building a working system is only half the effort.', [['Internal ownership', 'Assign a client-side owner for every deployed workflow.'], ['Clear playbooks', 'Document repeatable processes for fast onboarding.'], ['Continuous maintenance', 'Refine workflows as business needs change.']], ['Software projects frequently fail after launch not because of technical bugs, but because teams lack clear ownership and operational playbooks.', 'Building a working system is only half the effort. Every deployed workflow needs a client-side owner, a simple reusable playbook, and a maintenance habit that keeps the system aligned with changing business needs.', 'Systems should be engineered to outlast their initial setup and support long-term scaling.']],
  ['proof-over-promises', 'Proof over Promises: How to Evaluate Software Deliverables', 'Delivery', 'In an industry filled with hype, evaluate technical deliverables with acceptance criteria that can be verified before launch.', [['Explicit checks', 'Define exact functional criteria before writing code.'], ['Verifiable architecture', 'Show working prototypes and real system builds.'], ['Honest scope', 'Deliver systems that can be maintained and operated reliably.']], ['In an industry filled with AI hype and unverified claims, technical deliverables need clear verification standards.', 'Avoid vague timelines, guaranteed financial ROI, or arbitrary performance metrics that cannot be verified up front. At Mobile Lab, “done” is defined by pre-agreed acceptance criteria established before work begins.', 'Demand objective proof, working architecture, and honest scope before deploying a new business system.']],
  ['tailoring-automation-trade-operations', 'Tailoring Automation to Trade Operations', 'Field operations', 'Auto shops, real estate agencies, rentals, and field services share the same core friction: missed inquiries, manual follow-up, and disconnected back-office data.', [['Capture and route', 'Unify lead intake and messaging.'], ['Schedule and follow up', 'Automate confirmations, quotes, and invoice reminders.'], ['Connect the field', 'Sync job details with accounting and inventory systems.']], ['Auto repair shops, real estate agencies, rental operations, and field services look different on the surface, but their operational bottlenecks are remarkably similar.', 'Trade and service operations commonly lose time through missed inquiries, manual scheduling and follow-up, and field data that fails to sync with back-office accounting or inventory.', 'A standardized core architecture covering lead capture, unified messaging, pipeline tracking, and invoice follow-ups can automate routine administration while maintaining high service quality.']],
];

const systems = [
  ['ava-angela-consulting', 'Ava Angela Consulting', 'All-in-One Operations & CRM Architecture', 'Client management, course delivery, billing, affiliate tracking, and email were split across separate tools.', 'A unified CRM connected client profiles to billing, learning modules, affiliate commissions, and milestone-based email workflows.', 'A single purchase created the CRM record, updated affiliate balances, and issued portal access without manual admin work.'],
  ['myrider-ph', 'MyRider PH', 'Local Delivery Marketplace & Dispatch Engine', 'Dispatch required constant manual status checks between customers, merchants, and riders.', 'A real-time three-way marketplace routed jobs, updated order status, and reconciled cash-on-delivery settlement.', 'End-to-end tests confirmed automatic rider dispatch, merchant inventory updates, and balanced COD collections.'],
  ['vitalspark', 'VitalSpark', 'Personal Health & Adaptive Training Engine', 'Static workout and diet plans required trainers to manually adjust routines and targets.', 'A personalized plan engine combined workout, nutrition, live session tracking, and rules-based adjustments.', 'Performance and compliance logs dynamically changed workout intensity and daily nutrient targets.'],
  ['arbiscout-de', 'ArbiScout DE', 'E-Commerce Margin Validation & Automated Matching', 'Manual price checks missed marketplace fees, shipping costs, currency conversion, and VAT impacts.', 'A cross-reference engine compared supplier inventory with Amazon.de listings and filtered for validated net profit.', 'Candidate listings were checked against supplier invoices and settlement reports before execution.'],
  ['harcourts-crm', 'Harcourts CRM', 'Real Estate Pipeline & Public Record Intelligence', 'Buyer inquiries were disconnected from public property records, leading to missed listing opportunities.', 'A CRM pipeline cross-referenced public transactions, surfaced listing gaps, and routed buyer and seller leads.', 'Test registry feeds populated unmatched property records as high-priority agent tasks.'],
  ['adlab-ai', 'AdLab AI', 'Messenger-First Campaign Workflow', 'Static landing pages and slow manual DM queues lost lead intent.', 'An ad-to-Messenger pipeline captured intent, qualified prospects, and routed scored leads to sales reps.', 'Testing showed clicks opened a chat, captured intent, and created a prospect record in under 30 seconds.'],
  ['cbn-ads', 'CBN Ads', 'Campaign & Messaging Workflow Engine', 'Briefs, creative variations, and performance notes were copied across chat groups and spreadsheets.', 'A structured campaign workflow connected intake, task assignment, status tracking, and messaging logs.', 'Brief submission generated creative tasks, assigned media buyers, and updated campaign dashboards.'],
  ['robels-crm', 'Robel’s CRM', 'Operational Client Tracking Platform', 'Paper records and messaging threads delayed the link between field work and invoicing.', 'A live service CRM tracked job status and synced field updates to billing records.', 'Completing a mobile job updated the client ledger and generated an invoice draft.'],
  ['superguardian', 'SuperGuardian', 'Professional Services Workflow & Compliance System', 'Manual document reviews created bottlenecks and human-error risk in compliance work.', 'A validation pipeline enforced milestone gates and recorded every review in a traceable audit log.', 'Incomplete files triggered review holds before final approval.'],
  ['amazon-fba-ph-ecommerce', 'Amazon FBA & Philippine E-Commerce Operations', 'Multi-Channel Inventory & Order Settlement Platform', 'International FBA and local shop operations caused inventory discrepancies and reconciliation work.', 'A unified inventory and order platform connected fulfillment, stock deductions, payments, and settlements.', 'Multi-channel stress tests confirmed global inventory updates and accurate settlement figures.'],
];

const nav = (current = '') => `<header class="content-header"><div class="content-nav"><a href="/" aria-label="Mobile Lab home"><img src="/assets/mobilelab-logo.svg" alt="Mobile Lab"></a><nav class="content-nav-links" aria-label="Primary navigation"><a href="/services">Services</a><a href="/how-we-work">How We Work</a><a href="/blog" ${current === 'blog' ? 'aria-current="page"' : ''}>Blog</a><a href="/work" ${current === 'work' ? 'aria-current="page"' : ''}>Projects</a><a href="/about">About</a><a href="/contact" class="nav-cta">Talk to Us</a></nav></div></header>`;
const footer = () => `<footer class="content-footer"><div class="footer-inner"><span>© ${new Date().getFullYear()} Mobile Lab</span><nav class="footer-links" aria-label="Footer navigation"><a href="/services">Services</a><a href="/blog">Blog</a><a href="/work">Projects</a><a href="/about">About</a><a href="/contact">Contact</a></nav></div></footer>`;
const esc = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const card = (item, index, type) => `<article class="content-card"><span class="card-number">${String(index + 1).padStart(2, '0')} · ${type === 'blog' ? esc(item[2]) : 'FOUNDER-BUILT'}</span><h2>${esc(item[1])}</h2><p>${esc(type === 'blog' ? item[3] : item[4])}</p><a class="card-link" href="/${type === 'blog' ? 'blog' : 'work'}/${item[0]}">Read ${type === 'blog' ? 'the post' : 'the case study'} <span aria-hidden="true">→</span></a></article>`;

const headingSlug = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
const articleWordCount = (item, article) => {
  const text = [item[3], ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.subsections || []).flatMap((subsection) => [subsection.heading, ...subsection.paragraphs, ...(subsection.faq || []).flat()])])].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
};

function renderBlogSections(article) {
  const headings = [];
  const usedIds = new Set();
  const uniqueId = (heading) => {
    const base = headingSlug(heading) || 'section';
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    return id;
  };
  const html = article.sections.map((section) => {
    const sectionId = uniqueId(section.heading);
    headings.push({ id: sectionId, label: section.heading, level: 2 });
    const sectionBody = section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('');
    const subsections = (section.subsections || []).map((subsection) => {
      const subsectionId = uniqueId(subsection.heading);
      headings.push({ id: subsectionId, label: subsection.heading, level: 3 });
      const faq = (subsection.faq || []).map(([question, answer]) => `<h4>${esc(question)}</h4><p>${esc(answer)}</p>`).join('');
      return `<h3 id="${subsectionId}">${esc(subsection.heading)}</h3>${subsection.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}${faq}`;
    }).join('');
    return `<h2 id="${sectionId}">${esc(section.heading)}</h2>${sectionBody}${subsections}`;
  }).join('');
  return { html, headings };
}

function setupTableOfContents(headings) {
  const tocHeadings = headings.filter(({ level }) => level === 2);
  const links = [...document.querySelectorAll('.toc-link')];
  const targets = tocHeadings.map(({ id }) => document.getElementById(id)).filter(Boolean);
  const activate = (id) => links.forEach((link) => {
    const active = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (!targets.length) return;
  activate(targets[0].id);
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) activate(visible[0].target.id);
  }, { rootMargin: '-118px 0px -62% 0px', threshold: 0 });
  targets.forEach((target) => observer.observe(target));
}

function renderIndex(type) {
  const list = type === 'blog' ? posts : systems;
  if (!list.length) {
    document.querySelector('#app').innerHTML = `<div class="content-shell">${nav(type)}<main class="content-main content-hero"><span class="eyebrow">Mobile Lab</span><h1>No content yet.</h1><p>There is nothing published in this section yet.</p></main>${footer()}</div>`;
    return;
  }
  const title = type === 'blog' ? 'Operational notes for better systems.' : 'Selected systems, honestly labeled.';
  const intro = type === 'blog' ? 'Practical thinking on automation, operational design, and the work it takes to make systems stick.' : 'Founder-built software and operational architecture. See how data flows, what changed, and how “done” was proven.';
  document.title = `${type === 'blog' ? 'Blog' : 'Selected Systems'} | Mobile Lab`;
  document.querySelector('#app').innerHTML = `<div class="content-shell${type === 'work' ? ' work-light-shell' : ''}">${nav(type)}<main class="content-main"><section class="content-hero"><span class="eyebrow">Mobile Lab · ${type === 'blog' ? 'Field notes' : 'Project archive'}</span><h1>${title}</h1><p>${intro}</p></section><section class="content-grid" aria-label="${type === 'blog' ? 'Blog posts' : 'Case studies'}">${list.map((item, index) => card(item, index, type)).join('')}</section></main>${footer()}</div>`;
}

function renderDetail(type, slug) {
  const item = (type === 'blog' ? posts : systems).find((entry) => entry[0] === slug);
  if (!item) return renderIndex(type);
  const isBlog = type === 'blog';
  const title = item[1];
  const sections = isBlog ? item[4].map(([heading, body]) => `<li><strong>${esc(heading)}:</strong> ${esc(body)}</li>`).join('') : `<p><strong>The challenge:</strong> ${esc(item[3])}</p><p><strong>The solution:</strong> ${esc(item[4])}</p><p><strong>How done was proven:</strong> ${esc(item[5])}</p>`;
  document.title = `${title} | Mobile Lab`;
  const body = isBlog
    ? `${item[5].map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}<h2>What to do next</h2><ol>${sections}</ol>`
    : `<p><strong>The challenge:</strong> ${esc(item[3])}</p><p><strong>The solution:</strong> ${esc(item[4])}</p><p><strong>How done was proven:</strong> ${esc(item[5])}</p>`;
  if (!isBlog) {
    document.querySelector('#app').innerHTML = `<div class="content-shell work-light-shell">${nav(type)}<main class="content-main article-wrap"><article class="article"><span class="eyebrow">Founder-built system</span><h1>${esc(title)}</h1><div class="article-meta"><span class="tag">Founder-built</span><span class="tag">Mobile Lab</span></div><p class="article-intro">${esc(item[4])}</p><div class="article-body"><h2>${esc(item[2])}</h2>${body}</div><div class="article-cta"><strong>Have a similar operational challenge?</strong><br><span>Tell us where work gets stuck — we’ll diagnose before we build.</span><br><a href="/contact">Talk to us <span aria-hidden="true">→</span></a></div></article></main>${footer()}</div>`;
    return;
  }

  const article = expandedArticles[slug];
  if (!article) return renderIndex(type);
  const rendered = renderBlogSections(article);
  const wordCount = articleWordCount(item, article);
  const readingTime = Math.max(1, Math.ceil(wordCount / 225));
  const tocLinks = rendered.headings.filter(({ level }) => level === 2).map(({ id, label }) => `<a class="toc-link" href="#${id}">${esc(label)}</a>`).join('');
  const related = posts.filter((post) => post[0] !== slug).slice(0, 2);
  const relatedLinks = related.map((post) => `<a class="related-link" href="/blog/${post[0]}"><span>${esc(post[2])}</span><strong>${esc(post[1])}</strong></a>`).join('');

  const articleHtml = `<article class="blog-article article"><h1>${esc(title)}</h1><div class="article-meta"><span class="tag">${esc(item[2])}</span><span class="tag">By Mobile Lab</span><span class="tag">${wordCount.toLocaleString()} words · ${readingTime} min read</span></div><p class="article-intro">${esc(item[3])}</p><figure class="article-featured"><img src="/assets/images/method-diagnose.webp" alt="Mobile Lab diagnostic workflow map" width="1600" height="900" fetchpriority="high"></figure><div class="article-body">${rendered.html}</div></article>`;
  const resourcesHtml = `<aside class="blog-aside" aria-label="Article resources"><section class="lead-card" aria-labelledby="lead-heading"><h2 id="lead-heading">Stay close to the work.</h2><p>This form is not connected in this build. No email is collected or sent.</p><form class="lead-form" aria-describedby="lead-status"><label for="lead-email">Email address</label><input id="lead-email" type="email" autocomplete="email" placeholder="you@company.com"><button id="lead-magnet-submit" type="submit" disabled>Notify me when available</button></form><p class="form-note" id="lead-status" role="status">Lead magnet delivery still needs an approved integration.</p></section><section class="testimonial-card" aria-labelledby="testimonial-heading"><h2 id="testimonial-heading">Built for work that has to hold.</h2><blockquote>“Mobile Lab cut through months of AI noise. They diagnosed our exact dispatch bottleneck in 48 hours and shipped a rock-solid system that runs daily without breaking.”</blockquote><cite>Operations Director<br><span>Logistics &amp; Delivery Network</span></cite></section></aside>`;
  document.querySelector('#app').innerHTML = `<div class="content-shell blog-detail-shell">${nav('blog')}<main class="content-main blog-detail-layout"><div class="blog-detail-grid"><aside class="blog-sidebar" aria-label="Table of contents"><h2>In this article</h2><nav class="blog-nav-list toc-list" aria-label="Article sections">${tocLinks}</nav></aside>${articleHtml}${resourcesHtml}</div><section class="related-content blog-full-row" aria-labelledby="related-heading"><h2 id="related-heading">Other blog posts that you might be interested with:</h2><div class="related-links">${relatedLinks}</div></section><section class="article-cta blog-full-row blog-detail-cta"><strong>Have a similar bottleneck?</strong><br><span>Tell us where work gets stuck — we’ll diagnose before we build.</span><br><a href="/contact">Talk to us <span aria-hidden="true">→</span></a></section></main>${footer()}</div>`;
  setupTableOfContents(rendered.headings);
  document.querySelector('.lead-form')?.addEventListener('submit', (event) => event.preventDefault());
}

const pathParts = window.location.pathname.split('/').filter(Boolean);
if (pathParts[0] === 'blog') pathParts[1] ? renderDetail('blog', pathParts[1]) : renderIndex('blog');
else if (pathParts[0] === 'work') pathParts[1] ? renderDetail('work', pathParts[1]) : renderIndex('work');
