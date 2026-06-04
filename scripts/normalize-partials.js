const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'partials');
const files = ['topbar.html', 'footer.html', 'aside.html', 'header.html'];
const close = '</div>';

for (const name of files) {
	const fp = path.join(root, name);
	let s = fs.readFileSync(fp, 'utf8');
	s = s.replace(/<\/div >/g, close);
	fs.writeFileSync(fp, s);
	console.log('normalized', name);
}
