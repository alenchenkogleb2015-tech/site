const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = ['index.html', 'contacts.html', 'schedule.html'];

const burger =
	'\t\t\t\t<button\n' +
	'\t\t\t\t\ttype="button"\n' +
	'\t\t\t\t\tclass="header__burger"\n' +
	'\t\t\t\t\taria-label="Открыть меню"\n' +
	'\t\t\t\t\taria-expanded="false"\n' +
	'\t\t\t\t\taria-controls="site-nav"\n' +
	'\t\t\t\t>\n' +
	'\t\t\t\t\t<span class="header__burger-line"></span>\n' +
	'\t\t\t\t\t<span class="header__burger-line"></span>\n' +
	'\t\t\t\t\t<span class="header__burger-line"></span>\n' +
	'\t\t\t\t</button>\n\n';

for (const file of pages) {
	let html = fs.readFileSync(path.join(root, file), 'utf8');

	if (!html.includes('header__burger')) {
		html = html.replace('<nav class="nav">', burger + '<nav class="nav" id="site-nav">');
	} else if (!html.includes('id="site-nav"')) {
		html = html.replace('<nav class="nav"', '<nav class="nav" id="site-nav"');
	}

	if (!html.includes('header__appointment')) {
		html = html.replace(/class="btn">(\s*Запись на прием\s*<\/a>)/g, 'class="btn header__appointment">$1');
	}

	html = html.replace(
		/(logo logo__footer">[\s\S]*?<\/div>\s*\n\s*)<div>(\s*\n\s*<motion class="logo__title">)/,
		'$1<div class="logo__footer-text">$2'
	);

	html = html.replace(
		/(logo logo__footer">[\s\S]*?<\/div>\s*\n\s*)<div>(\s*\n\s*<div class="logo__title">)/,
		'$1<div class="logo__footer-text">$2'
	);

	if (!html.includes('js/main.js')) {
		html = html.replace('</body>', '\t\t<script src="js/main.js"></script>\n\t</body>');
	}

	fs.writeFileSync(path.join(root, file), html, 'utf8');
	console.log('patched', file);
}
