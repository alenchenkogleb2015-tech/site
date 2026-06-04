const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const dirs = ['css', 'js', 'assets/images', 'scripts'];
dirs.forEach((d) => fs.mkdirSync(path.join(root, d), { recursive: true }));

const moves = [
	['styles.css', 'css/styles.css'],
	['main.js', 'js/main.js'],
	['build_schedule.js', 'scripts/build_schedule.js'],
	['patch_schedule.js', 'scripts/patch_schedule.js'],
	['patch_header_footer.js', 'scripts/patch_header_footer.js'],
	['schedule_accordion.html', 'scripts/schedule_accordion.html'],
];

const imageExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
fs.readdirSync(root).forEach((name) => {
	const ext = path.extname(name).toLowerCase();
	if (imageExt.includes(ext)) {
		moves.push([name, path.join('assets/images', name)]);
	}
});

for (const [from, to] of moves) {
	const src = path.join(root, from);
	const dest = path.join(root, to);
	if (fs.existsSync(src) && !fs.existsSync(dest)) {
		fs.renameSync(src, dest);
		console.log('moved', from, '->', to);
	}
}

const htmlPages = ['index.html', 'contacts.html', 'schedule.html'].filter((f) =>
	fs.existsSync(path.join(root, f))
);

function updateHtml(html) {
	let out = html;
	out = out.replace(/href="styles\.css"/g, 'href="css/styles.css"');
	out = out.replace(/src="main\.js"/g, 'src="js/main.js"');
	out = out.replace(/src="\.\/лого\.png"/g, 'src="assets/images/лого.png"');
	out = out.replace(/src="лого\.png"/g, 'src="assets/images/лого.png"');
	return out;
}

htmlPages.forEach((file) => {
	const filePath = path.join(root, file);
	let html = fs.readFileSync(filePath, 'utf8');
	fs.writeFileSync(filePath, updateHtml(html), 'utf8');
	console.log('updated', file);
});

const cssPath = path.join(root, 'css/styles.css');
if (fs.existsSync(cssPath)) {
	let css = fs.readFileSync(cssPath, 'utf8');
	css = css.replace(/url\('\.\/баннер1\.png'\)/g, "url('../assets/images/баннер1.png')");
	css = css.replace(/url\('\.\/баннер2\.png'\)/g, "url('../assets/images/баннер2.png')");
	css = css.replace(/url\('\.\/баннер3\.jpg'\)/g, "url('../assets/images/баннер3.jpg')");
	fs.writeFileSync(cssPath, css, 'utf8');
	console.log('updated css/styles.css');
}

const patchSchedule = path.join(root, 'scripts/patch_schedule.js');
if (fs.existsSync(patchSchedule)) {
	let js = fs.readFileSync(patchSchedule, 'utf8');
	js = js.replace("__dirname, 'schedule.html'", "__dirname, '..', 'schedule.html'");
	js = js.replace("__dirname, 'schedule_accordion.html'", "__dirname, 'schedule_accordion.html'");
	fs.writeFileSync(patchSchedule, js, 'utf8');
}

const buildSchedule = path.join(root, 'scripts/build_schedule.js');
if (fs.existsSync(buildSchedule)) {
	let js = fs.readFileSync(buildSchedule, 'utf8');
	js = js.replace('path.join(__dirname, \'schedule_accordion.html\')', "path.join(__dirname, 'schedule_accordion.html')");
	fs.writeFileSync(buildSchedule, js, 'utf8');
}

console.log('done');
