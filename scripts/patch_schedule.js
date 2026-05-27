const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const schedulePath = path.join(root, 'schedule.html');
const accordionPath = path.join(__dirname, 'schedule_accordion.html');
let html = fs.readFileSync(schedulePath, 'utf8');
const accordion = fs.readFileSync(accordionPath, 'utf8');
const marker = '<h1 class="schedule-page__title">График работы врачей</h1>';
const accordionStart = html.indexOf('<div class="schedule-accordion">');
const ctaStart = html.indexOf('<section class="cta">');

if (accordionStart !== -1 && ctaStart !== -1) {
  html =
    html.slice(0, accordionStart) +
    accordion +
    '\n\t\t\t</div>\n\t\t</main>\n\n\t\t' +
    html.slice(ctaStart);
} else if (html.includes(marker)) {
  html = html.replace(marker, marker + '\n' + accordion);
} else {
  console.error('cannot patch');
  process.exit(1);
}

fs.writeFileSync(schedulePath, html, 'utf8');
console.log('patched');
