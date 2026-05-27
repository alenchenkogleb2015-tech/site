function initSearch() {
	const input = document.querySelector('.header__search-input');
	if (!input) return;

	let index = [];
	let selectedIdx = -1;
	let results = [];

	const container = document.createElement('div');
	container.className = 'search-dropdown';
	container.hidden = true;
	input.parentNode.appendChild(container);

	function normalize(text) {
		return text.toLowerCase().replace(/ё/g, 'е');
	}

	function highlight(text, query) {
		const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
		return text.replace(re, '<mark>$1</mark>');
	}

	function render() {
		if (!results.length || !input.value.trim()) {
			container.hidden = true;
			return;
		}
		container.hidden = false;
		container.innerHTML = results.map(function(r, i) {
			return '<a href="' + r.url + '" class="search-dropdown__item' + (i === selectedIdx ? ' search-dropdown__item--active' : '') + '">' +
				'<span class="search-dropdown__title">' + highlight(r.title, input.value.trim()) + '</span>' +
				'<span class="search-dropdown__section">' + r.section + '</span>' +
				'<span class="search-dropdown__text">' + highlight(r.text.slice(0, 100), input.value.trim()) + '</span>' +
			'</a>';
		}).join('');
	}

	function search(query) {
		if (!query.trim()) { results = []; render(); return; }
		var q = normalize(query.trim());
		results = index.filter(function(item) {
			return normalize(item.title).indexOf(q) !== -1 || normalize(item.text).indexOf(q) !== -1;
		}).slice(0, 8);
		selectedIdx = -1;
		render();
	}

	function loadIndex() {
		try {
			var data = window.SEARCH_INDEX;
			if (data) { index = data; return; }
		} catch(e) {}

		fetch('data/search-index.json')
			.then(function(r) { return r.json(); })
			.then(function(data) {
				index = data;
				if (input.value.trim()) search(input.value);
			})
			.catch(function() {});
	}

	input.addEventListener('input', function() {
		search(input.value);
	});

	input.addEventListener('focus', function() {
		if (results.length) container.hidden = false;
	});

	input.addEventListener('blur', function() {
		setTimeout(function() { container.hidden = true; }, 200);
	});

	input.addEventListener('keydown', function(e) {
		var items = container.querySelectorAll('.search-dropdown__item');
		if (!items.length) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
			render();
			items[selectedIdx].scrollIntoView({ block: 'nearest' });
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIdx = Math.max(selectedIdx - 1, 0);
			render();
			items[selectedIdx].scrollIntoView({ block: 'nearest' });
		} else if (e.key === 'Enter' && selectedIdx >= 0) {
			e.preventDefault();
			items[selectedIdx].click();
		} else if (e.key === 'Escape') {
			container.hidden = true;
			input.blur();
		}
	});

	loadIndex();
}
