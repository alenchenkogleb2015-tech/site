const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const partialsDir = path.join(root, 'partials');
const keys = ['topbar', 'header', 'footer', 'cta', 'aside'];

const data = {};
for (const key of keys) {
	data[key] = fs.readFileSync(path.join(partialsDir, `${key}.html`), 'utf8');
}

const out = `/* Auto-generated — run: node scripts/build-partials-inline.js */
window.SITE_PARTIALS = ${JSON.stringify(data)};
`;

fs.writeFileSync(path.join(root, 'js', 'partials-inline.js'), out);

const news = JSON.parse(fs.readFileSync(path.join(root, 'data', 'news.json'), 'utf8'));
const newsOut = `/* Auto-generated */\nwindow.SITE_NEWS = ${JSON.stringify(news)};\n`;
fs.writeFileSync(path.join(root, 'js', 'news-inline.js'), newsOut);

const searchIndex = JSON.parse(fs.readFileSync(path.join(root, 'data', 'search-index.json'), 'utf8'));
const searchOut = `/* Auto-generated */\nwindow.SEARCH_INDEX = ${JSON.stringify(searchIndex)};\n`;
fs.writeFileSync(path.join(root, 'js', 'search-inline.js'), searchOut);

console.log('Built js/partials-inline.js, js/news-inline.js, js/search-inline.js');
