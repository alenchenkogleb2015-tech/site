const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const D = 'd' + 'i' + 'v';
const close = '</' + D + '>';
const open = '<' + D;

function shellStart(title, page) {
	return `<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="css/styles.css" />
</head>
<body data-page="${page}">
${open} data-partial="topbar">${close}
${open} data-partial="header">${close}
`;
}

const shellEnd = `
${open} data-partial="cta">${close}
${open} data-partial="footer">${close}
<script src="js/main.js"></script>
<script src="js/layout.js"></script>
</body>
</html>
`;

function patchIndex() {
	let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
	const mainStart = html.indexOf('<main class="main-layout">');
	const mainEnd = html.indexOf('</main>') + 7;
	let main = html.slice(mainStart, mainEnd);

	main = main.replace(
		/<!-- SIDEBAR -->[\s\S]*?<aside[\s\S]*?<\/aside>/,
		`<!-- SIDEBAR -->\n\t\t\t\t${open} data-partial="aside">${close}`
	);

	main = main.replace(
		/<div class="news__grid"[^>]*>[\s\S]*?<\/section>/,
		`${open} class="news__grid" data-news-grid>${close}\n\t\t\t\t\t\t${close}\n\t\t\t\t\t</section>`
	);

	fs.writeFileSync(
		path.join(root, 'index.html'),
		shellStart('Николаевская районная больница', 'index') + main + shellEnd
	);
}

function patchSchedule() {
	let html = fs.readFileSync(path.join(root, 'schedule.html'), 'utf8');
	const mainStart = html.indexOf('<main class="main-layout');
	const mainEnd = html.indexOf('</main>') + 7;
	let main = html.slice(mainStart, mainEnd);

	main = main.replace(
		/<aside[\s\S]*?<\/aside>/,
		`${open} data-partial="aside">${close}`
	);

	fs.writeFileSync(
		path.join(root, 'schedule.html'),
		shellStart('График работы врачей — Николаевская районная больница', 'schedule') +
			main +
			shellEnd
	);
}

function patchContacts() {
	let html = fs.readFileSync(path.join(root, 'contacts.html'), 'utf8');
	const mainStart = html.indexOf('<main class="main-layout');
	const mainEnd = html.indexOf('</main>') + 7;
	let main = html.slice(mainStart, mainEnd);

	main = main.replace(/<aside class="contacts-map"[\s\S]*?<\/aside>\s*/g, '');
	main = main.replace(
		/<aside[\s\S]*?<\/aside>/,
		`${open} data-partial="aside">${close}`
	);
	main = main.replace(
		/<motion class="contacts-page__grid">|<div class="contacts-page__grid">/,
		`${open} class="contacts-page__content-wrap">`
	);

	fs.writeFileSync(
		path.join(root, 'contacts.html'),
		shellStart('Контакты — Николаевская районная больница', 'contacts') + main + shellEnd
	);
}

patchIndex();
patchSchedule();
patchContacts();
console.log('done');
