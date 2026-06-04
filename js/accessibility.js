(function () {
	const STORAGE_KEY = 'nikolaevka-a11y';
	const DEFAULTS = {
		enabled: false,
		font: '1',
		theme: 'default',
		spacing: '1',
		images: true,
	};

	function readSettings() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return { ...DEFAULTS };
			return { ...DEFAULTS, ...JSON.parse(raw) };
		} catch {
			return { ...DEFAULTS };
		}
	}

	function writeSettings(settings) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	}

	function classListFor(settings) {
		const list = [];
		if (settings.enabled) list.push('a11y-on');
		list.push(`a11y-font-${settings.font}`);
		list.push(`a11y-theme-${settings.theme}`);
		list.push(`a11y-spacing-${settings.spacing}`);
		if (settings.enabled && !settings.images) list.push('a11y-images-off');
		return list;
	}

	function applySettings(settings) {
		const html = document.documentElement;
		html.classList.remove(
			'a11y-on',
			'a11y-font-1',
			'a11y-font-2',
			'a11y-font-3',
			'a11y-theme-default',
			'a11y-theme-bw',
			'a11y-theme-wb',
			'a11y-theme-blue',
			'a11y-spacing-1',
			'a11y-spacing-2',
			'a11y-spacing-3',
			'a11y-images-off'
		);
		classListFor(settings).forEach((cls) => html.classList.add(cls));
	}

	function isAccessibilityActive(settings) {
		return (
			settings.font !== DEFAULTS.font ||
			settings.theme !== DEFAULTS.theme ||
			settings.spacing !== DEFAULTS.spacing ||
			settings.images !== DEFAULTS.images
		);
	}

	function syncPanelUI(panel, settings) {
		panel.querySelectorAll('[data-a11y-font]').forEach((btn) => {
			btn.classList.toggle('is-active', btn.dataset.a11yFont === settings.font);
			btn.setAttribute('aria-pressed', btn.dataset.a11yFont === settings.font ? 'true' : 'false');
		});
		panel.querySelectorAll('[data-a11y-theme]').forEach((btn) => {
			btn.classList.toggle('is-active', btn.dataset.a11yTheme === settings.theme);
			btn.setAttribute('aria-pressed', btn.dataset.a11yTheme === settings.theme ? 'true' : 'false');
		});
		panel.querySelectorAll('[data-a11y-spacing]').forEach((btn) => {
			btn.classList.toggle('is-active', btn.dataset.a11ySpacing === settings.spacing);
			btn.setAttribute('aria-pressed', btn.dataset.a11ySpacing === settings.spacing ? 'true' : 'false');
		});
		const imagesBtn = panel.querySelector('[data-a11y-images]');
		if (imagesBtn) {
			imagesBtn.classList.toggle('is-active', settings.images);
			imagesBtn.setAttribute('aria-pressed', settings.images ? 'true' : 'false');
			imagesBtn.textContent = settings.images ? 'Показаны' : 'Скрыты';
		}
	}

	function buildPanel() {
		const panel = document.createElement('div');
		panel.id = 'a11y-panel';
		panel.className = 'a11y-panel';
		panel.hidden = true;
		panel.setAttribute('role', 'region');
		panel.setAttribute('aria-label', 'Настройки версии для слабовидящих');
		panel.innerHTML = `
			<div class="a11y-panel__inner container">
				<div class="a11y-panel__head">
					<h2 class="a11y-panel__title">Версия для слабовидящих</h2>
					<button type="button" class="a11y-panel__close" data-a11y-close aria-label="Закрыть панель"></button>
				</div>
				<div class="a11y-panel__grid">
					<div class="a11y-panel__group">
						<span class="a11y-panel__label" id="a11y-label-font">Размер шрифта</span>
						<div class="a11y-panel__buttons" role="group" aria-labelledby="a11y-label-font">
							<button type="button" class="a11y-panel__btn" data-a11y-font="1" aria-pressed="true">A</button>
							<button type="button" class="a11y-panel__btn a11y-panel__btn--lg" data-a11y-font="2" aria-pressed="false">A</button>
							<button type="button" class="a11y-panel__btn a11y-panel__btn--xl" data-a11y-font="3" aria-pressed="false">A</button>
						</div>
					</div>
					<div class="a11y-panel__group">
						<span class="a11y-panel__label" id="a11y-label-theme">Цвет сайта</span>
						<div class="a11y-panel__buttons a11y-panel__buttons--wrap" role="group" aria-labelledby="a11y-label-theme">
							<button type="button" class="a11y-panel__btn" data-a11y-theme="default" aria-pressed="true">Обычный</button>
							<button type="button" class="a11y-panel__btn a11y-panel__btn--theme-bw" data-a11y-theme="bw" aria-pressed="false">Чёрный</button>
							<button type="button" class="a11y-panel__btn a11y-panel__btn--theme-wb" data-a11y-theme="wb" aria-pressed="false">Белый</button>
							<button type="button" class="a11y-panel__btn a11y-panel__btn--theme-blue" data-a11y-theme="blue" aria-pressed="false">Синий</button>
						</div>
					</div>
					<div class="a11y-panel__group">
						<span class="a11y-panel__label" id="a11y-label-spacing">Интервал</span>
						<div class="a11y-panel__buttons" role="group" aria-labelledby="a11y-label-spacing">
							<button type="button" class="a11y-panel__btn" data-a11y-spacing="1" aria-pressed="true">Стандарт</button>
							<button type="button" class="a11y-panel__btn" data-a11y-spacing="2" aria-pressed="false">Средний</button>
							<button type="button" class="a11y-panel__btn" data-a11y-spacing="3" aria-pressed="false">Большой</button>
						</div>
					</div>
					<div class="a11y-panel__group">
						<span class="a11y-panel__label" id="a11y-label-images">Изображения</span>
						<div class="a11y-panel__buttons" role="group" aria-labelledby="a11y-label-images">
							<button type="button" class="a11y-panel__btn" data-a11y-images aria-pressed="true">Показаны</button>
						</div>
					</div>
				</div>
				<button type="button" class="a11y-panel__reset" data-a11y-reset>Обычная версия сайта</button>
			</div>
		`;
		const topbar = document.querySelector('.topbar');
		if (topbar) topbar.insertAdjacentElement('afterend', panel);
		else document.body.prepend(panel);
		return panel;
	}

	function setPanelOpen(panel, toggle, open) {
		panel.hidden = !open;
		if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		document.body.classList.toggle('a11y-panel-open', open);
	}

	window.initAccessibility = function initAccessibility() {
		let settings = readSettings();
		applySettings(settings);

		let panel = document.getElementById('a11y-panel');
		if (!panel) panel = buildPanel();

		const toggle = document.querySelector('.topbar__a11y-toggle');
		syncPanelUI(panel, settings);

		function commit(next) {
			settings = { ...settings, ...next };
			settings.enabled = isAccessibilityActive(settings);
			applySettings(settings);
			writeSettings(settings);
			syncPanelUI(panel, settings);
			if (toggle) {
				toggle.classList.toggle('is-active', settings.enabled);
			}
		}

		function openPanel() {
			setPanelOpen(panel, toggle, true);
		}

		function closePanel() {
			setPanelOpen(panel, toggle, false);
		}

		toggle?.addEventListener('click', () => {
			if (panel.hidden) openPanel();
			else closePanel();
		});

		panel.querySelector('[data-a11y-close]')?.addEventListener('click', closePanel);

		panel.querySelector('[data-a11y-reset]')?.addEventListener('click', () => {
			settings = { ...DEFAULTS };
			applySettings(settings);
			writeSettings(settings);
			syncPanelUI(panel, settings);
			if (toggle) toggle.classList.remove('is-active');
			closePanel();
		});

		panel.querySelectorAll('[data-a11y-font]').forEach((btn) => {
			btn.addEventListener('click', () => commit({ font: btn.dataset.a11yFont }));
		});

		panel.querySelectorAll('[data-a11y-theme]').forEach((btn) => {
			btn.addEventListener('click', () => commit({ theme: btn.dataset.a11yTheme }));
		});

		panel.querySelectorAll('[data-a11y-spacing]').forEach((btn) => {
			btn.addEventListener('click', () => commit({ spacing: btn.dataset.a11ySpacing }));
		});

		panel.querySelector('[data-a11y-images]')?.addEventListener('click', () => {
			commit({ images: !settings.images });
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !panel.hidden) closePanel();
		});

		document.addEventListener('click', (event) => {
			if (panel.hidden) return;
			const target = event.target;
			if (panel.contains(target) || toggle?.contains(target)) return;
			closePanel();
		});

		if (toggle) toggle.classList.toggle('is-active', settings.enabled);
	};

	applySettings(readSettings());
})();
