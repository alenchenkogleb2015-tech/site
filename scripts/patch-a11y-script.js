const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const tag = '<script src="js/accessibility.js" charset="utf-8"></script>\n';

for (const file of fs.readdirSync(root)) {
	if (!file.endsWith('.html')) continue;
	const filePath = path.join(root, file);
	let html = fs.readFileSync(filePath, 'utf8');
	if (html.includes('js/accessibility.js')) {
		console.log('skip', file);
		continue;
	}
	if (!html.includes('js/main.js')) {
		console.log('no main.js', file);
		continue;
	}
	html = html.replace(
		/<script src="js\/main\.js"/,
		tag + '<script src="js/main.js"'
	);
	fs.writeFileSync(filePath, html, 'utf8');
	console.log('patched', file);
}
