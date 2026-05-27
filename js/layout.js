const PARTIALS = {
	topbar: 'partials/topbar.html',
	header: 'partials/header.html',
	footer: 'partials/footer.html',
	cta: 'partials/cta.html',
	aside: 'partials/aside.html',
};

async function loadPartial(selector, url, key) {
	const host = document.querySelector(selector);
	if (!host) return;

	let html = '';

	try {
		const response = await fetch(url);
		if (response.ok) {
			html = await response.text();
		}
	} catch {
		/* fetch недоступен (file://) — используем встроенный бандл */
	}

	if (!html && window.SITE_PARTIALS && window.SITE_PARTIALS[key]) {
		html = window.SITE_PARTIALS[key];
	}

	if (!html) {
		console.error(`Не удалось загрузить partial: ${key}`);
		return;
	}

	host.outerHTML = html;
}

async function loadPartials() {
	await Promise.all([
		loadPartial('[data-partial="topbar"]', PARTIALS.topbar, 'topbar'),
		loadPartial('[data-partial="header"]', PARTIALS.header, 'header'),
		loadPartial('[data-partial="footer"]', PARTIALS.footer, 'footer'),
		loadPartial('[data-partial="cta"]', PARTIALS.cta, 'cta'),
		loadPartial('[data-partial="aside"]', PARTIALS.aside, 'aside'),
	]);
}

function setActiveNav() {
	const page = document.body.dataset.page;
	if (!page) return;

	document.querySelectorAll('.nav__link[data-nav]').forEach((link) => {
		link.classList.toggle('nav__link--active', link.dataset.nav === page);
	});
}

function initContactsAsideMap() {
	if (document.body.dataset.page !== 'contacts') return;

	const mapBlock = document.querySelector('[data-aside-map]');
	if (mapBlock) mapBlock.hidden = false;
}

async function renderNews() {
	const grid = document.querySelector('[data-news-grid]');
	if (!grid) return;

	let items = null;

	try {
		const response = await fetch('data/news.json');
		if (response.ok) {
			items = await response.json();
		}
	} catch {
		/* file:// */
	}

	if (!items && window.SITE_NEWS) {
		items = window.SITE_NEWS;
	}

	if (!items) return;

	grid.innerHTML = items
		.map(
			(item) => `
			<article class="news-card">
				<div class="news-card__content">
					<h3 class="news-card__title">${escapeHtml(item.title)}</h3>
					<div class="news-card__date">${escapeHtml(item.date)}</div>
					<p class="news-card__text">${item.text}</p>
				</div>
			</article>`
		)
		.join('');
}

function escapeHtml(text) {
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function updateCopyrightYear() {
	const el = document.getElementById('current-year');
	if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', async () => {
	await loadPartials();
	setActiveNav();
	initContactsAsideMap();
	updateCopyrightYear();
	await renderNews();

	if (typeof initBurgerMenu === 'function') initBurgerMenu();
	if (typeof initNewsCarousel === 'function') initNewsCarousel();
	if (typeof initSearch === 'function') initSearch();
	if (typeof initAppointmentModal === 'function') initAppointmentModal();
	if (typeof initChiefDoctorToggle === 'function') initChiefDoctorToggle();
});
