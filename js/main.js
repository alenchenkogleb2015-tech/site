function initBurgerMenu() {
	const burger = document.querySelector('.header__burger');
	const nav = document.getElementById('site-nav');

	if (!burger || !nav) return;

	burger.addEventListener('click', () => {
		const isOpen = document.body.classList.toggle('nav-open');
		burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	});

	nav.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			document.body.classList.remove('nav-open');
			burger.setAttribute('aria-expanded', 'false');
		});
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			document.body.classList.remove('nav-open');
			burger.setAttribute('aria-expanded', 'false');
		}
	});
}

function initNewsCarousel() {
	const scrollEl = document.querySelector('.news__scroll');
	const prevBtn = document.querySelector('.news__nav--prev');
	const nextBtn = document.querySelector('.news__nav--next');

	if (!scrollEl) return;

	const getStep = () => {
		const card = scrollEl.querySelector('.news-card');
		if (!card) return 384;
		return card.offsetWidth + 24;
	};

	const scrollByStep = (direction) => {
		const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
		if (maxScroll <= 0) return;

		if (direction > 0 && scrollEl.scrollLeft >= maxScroll - 8) {
			scrollEl.scrollTo({ left: 0, behavior: 'smooth' });
			return;
		}

		if (direction < 0 && scrollEl.scrollLeft <= 8) {
			scrollEl.scrollTo({ left: maxScroll, behavior: 'smooth' });
			return;
		}

		scrollEl.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
	};

	prevBtn?.addEventListener('click', () => scrollByStep(-1));
	nextBtn?.addEventListener('click', () => scrollByStep(1));

	let pointerId = null;
	let startX = 0;
	let scrollStart = 0;
	let moved = false;

	const endDrag = () => {
		if (pointerId !== null) {
			try {
				scrollEl.releasePointerCapture(pointerId);
			} catch {
				/* ignore */
			}
		}
		pointerId = null;
		scrollEl.classList.remove('is-dragging');
	};

	function isLink(el) {
		while (el && el !== scrollEl) {
			if (el.tagName === 'A') return true;
			el = el.parentElement;
		}
		return false;
	}

	scrollEl.addEventListener(
		'pointerdown',
		(event) => {
			if (event.pointerType === 'mouse' && event.button !== 0) return;
			if (isLink(event.target)) return;

			pointerId = event.pointerId;
			moved = false;
			startX = event.clientX;
			scrollStart = scrollEl.scrollLeft;
			scrollEl.classList.add('is-dragging');
			scrollEl.setPointerCapture(pointerId);
			event.preventDefault();
		},
		{ capture: true }
	);

	scrollEl.addEventListener('pointermove', (event) => {
		if (pointerId === null || event.pointerId !== pointerId) return;

		const delta = event.clientX - startX;
		if (Math.abs(delta) > 4) moved = true;

		scrollEl.scrollLeft = scrollStart - delta;
		event.preventDefault();
	});

	scrollEl.addEventListener('pointerup', (event) => {
		if (event.pointerId !== pointerId) return;
		endDrag();
	});

	scrollEl.addEventListener('pointercancel', (event) => {
		if (event.pointerId !== pointerId) return;
		endDrag();
	});

	scrollEl.addEventListener(
		'click',
		(event) => {
			if (moved) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		{ capture: true }
	);

	scrollEl.addEventListener('dragstart', (event) => event.preventDefault());
}

function convertSelectsToCustom() {
	var nativeSelects = document.querySelectorAll('.appointment__select');
	nativeSelects.forEach(function(sel) {
		if (sel.id === 'm-country') return;
		var field = sel.parentElement;
		var id = sel.id;
		var name = sel.name;
		var required = sel.required;
		var currentVal = sel.value || '';
		var options = [];
		for (var i = 0; i < sel.options.length; i++) {
			var o = sel.options[i];
			if (!o.value && o.disabled) continue;
			options.push({ value: o.value, text: o.text, selected: o.selected });
		}
		var hidden = document.createElement('input');
		hidden.type = 'hidden';
		hidden.name = name;
		hidden.id = id;
		hidden.value = currentVal;
		hidden.required = required;
		var trigger = document.createElement('div');
		trigger.className = 'appointment__custom-select';
		trigger.id = id + '-trigger';
		trigger.tabIndex = 0;
		trigger.setAttribute('role', 'combobox');
		trigger.setAttribute('aria-expanded', 'false');
		trigger.setAttribute('aria-controls', id + '-list');
		var display = document.createElement('span');
		var hasPlaceholder = sel.options.length > 0 && sel.options[0].disabled && !sel.options[0].value;
		var selectedOption = currentVal ? (options.filter(function(o) { return o.value === currentVal; })[0] || null) : null;
		display.textContent = selectedOption ? selectedOption.text : '';
		if (selectedOption) {
			trigger.dataset.filled = '1';
		} else if (hasPlaceholder) {
			trigger.dataset.filled = '0';
		}
		trigger.appendChild(display);
		var list = document.createElement('ul');
		list.className = 'appointment__custom-options';
		list.id = id + '-list';
		list.setAttribute('role', 'listbox');
		list.setAttribute('aria-hidden', 'true');
		options.forEach(function(o) {
			var li = document.createElement('li');
			li.setAttribute('role', 'option');
			li.setAttribute('data-value', o.value);
			li.setAttribute('aria-selected', o.selected ? 'true' : 'false');
			li.textContent = o.text;
			list.appendChild(li);
		});
		field.insertBefore(hidden, sel);
		field.insertBefore(trigger, sel);
		field.appendChild(list);
		field.removeChild(sel);
		var label = field.querySelector('.appointment__label--float');
		if (label && label.getAttribute('for') === id) {
			label.setAttribute('for', id + '-trigger');
		}
	});
}

function initAppointmentModal() {
	convertSelectsToCustom();
	var countryLabels = document.querySelectorAll('.appointment__field--code .appointment__label--float');
	countryLabels.forEach(function(lbl) {
		var forId = lbl.getAttribute('for');
		if (forId) {
			var el = document.getElementById(forId);
			if (el && (el.type === 'hidden' || el.tagName === 'SELECT')) {
				lbl.setAttribute('for', forId + '-trigger');
			}
		}
	});
}

function closeAllCustomSelects() {
	document.querySelectorAll('.appointment__custom-options[aria-hidden="false"]').forEach(function(list) {
		list.setAttribute('aria-hidden', 'true');
		var trig = document.getElementById(list.id.replace('-list', '-trigger'));
		if (trig) { trig.setAttribute('aria-expanded', 'false'); delete trig.dataset.open; }
	});
}

function resetCustomSelects() {
	document.querySelectorAll('.appointment__custom-select').forEach(function(trigger) {
		var listId = trigger.getAttribute('aria-controls');
		if (listId) {
			var list = document.getElementById(listId);
			if (list) list.setAttribute('aria-hidden', 'true');
		}
		trigger.setAttribute('aria-expanded', 'false');
		delete trigger.dataset.open;
		var id = trigger.id.replace('-trigger', '');
		var input = document.getElementById(id);
		var display = trigger.querySelector('span');
		if (!input || !display) return;
		if (id === 'm-country' || id === 'f-country' || id === 'a-country' || id === 'd-country') {
			display.textContent = '+7';
			input.value = '+7';
			trigger.dataset.filled = '1';
			if (input.tagName === 'SELECT') input.dataset.filled = '1';
		} else {
			display.textContent = '';
			input.value = '';
			delete trigger.dataset.filled;
		}
	});
}

function openModal(id) {
	var m = document.getElementById(id);
	if (!m) return;
	if (m.parentElement !== document.body) document.body.appendChild(m);
	m.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal--active');
	closeAllCustomSelects();
}

function closeModal(m) {
	m.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('modal--active');
	var bodyEl = m.querySelector('.modal__body');
	if (bodyEl) { bodyEl.style.height = ''; bodyEl.style.minHeight = ''; bodyEl.style.overflow = ''; bodyEl.style.display = ''; bodyEl.style.flexDirection = ''; }
	var form = m.querySelector('form');
	if (form) {
		form.querySelectorAll('.appointment__input--error').forEach(function(el) { el.classList.remove('appointment__input--error'); });
		var cb = form.querySelector('.appointment__checkbox');
		if (cb) cb.style.color = '';
		form.reset();
		form.removeAttribute('style');
	}
	m.querySelectorAll('.form-success').forEach(function(el) {
		el.hidden = true;
		el.classList.remove('form-success--done');
	});
	resetCustomSelects();
}

function showSuccess(text) {
	var el = document.createElement('div');
	el.className = 'success-toast';
	el.textContent = text;
	document.body.appendChild(el);
	requestAnimationFrame(function() {
		el.classList.add('success-toast--visible');
	});
	setTimeout(function() {
		el.classList.remove('success-toast--visible');
		setTimeout(function() { el.remove(); }, 400);
	}, 3500);
}

document.addEventListener('click', function(e) {
	var btn = e.target.closest('[data-modal-open]');
	if (btn) {
		var id = btn.getAttribute('data-modal-open');
		openModal(id);
		return;
	}
	var close = e.target.closest('[data-modal-close]');
	if (close) {
		var m = close.closest('.modal');
		if (m) closeModal(m);
		return;
	}
});

document.addEventListener('click', function(e) {
	var filterBtn = e.target.closest('.staff__filter');
	if (filterBtn) {
		var filter = filterBtn.getAttribute('data-filter');
		var parent = filterBtn.closest('.staff__body');
		if (!parent || !filter) return;
		parent.querySelectorAll('.staff__filter').forEach(function(b) {
			b.classList.remove('staff__filter--active');
		});
		filterBtn.classList.add('staff__filter--active');
		parent.querySelectorAll('.staff__card[data-specialty]').forEach(function(card) {
			card.hidden = (filter !== 'all' && card.getAttribute('data-specialty') !== filter);
		});
		return;
	}
	var staffBtn = e.target.closest('.staff__card-btn[data-doctor]');
	if (staffBtn) {
		var doctor = staffBtn.getAttribute('data-doctor');
		if (doctor) {
			var display = document.getElementById('m-doctor-display');
			if (display) display.textContent = doctor;
		}
		return;
	}
	var trigger = e.target.closest('.appointment__custom-select');
	if (trigger) {
		var list = document.getElementById(trigger.getAttribute('aria-controls'));
		if (!list) return;
		var isOpen = list.getAttribute('aria-hidden') === 'false';
		if (isOpen) {
			list.setAttribute('aria-hidden', 'true');
			trigger.setAttribute('aria-expanded', 'false');
			delete trigger.dataset.open;
		} else {
			closeAllCustomSelects();
			var rect = trigger.getBoundingClientRect();
			list.style.top = (rect.bottom + 4) + 'px';
			list.style.left = rect.left + 'px';
			list.style.minWidth = Math.max(rect.width, 200) + 'px';
			list.setAttribute('aria-hidden', 'false');
			trigger.setAttribute('aria-expanded', 'true');
			trigger.dataset.open = '1';
		}
		return;
	}
	var opt = e.target.closest('.appointment__custom-options li');
	if (opt) {
		var list = opt.closest('.appointment__custom-options');
		var trigger = document.getElementById(list.id.replace('-list', '-trigger'));
		if (!trigger) return;
		var value = opt.getAttribute('data-value');
		var hidden = document.getElementById(list.id.replace('-list', ''));
		if (hidden) {
			hidden.value = value;
			hidden.classList.remove('appointment__input--error');
		}
		trigger.classList.remove('appointment__input--error');
		list.setAttribute('aria-hidden', 'true');
		trigger.setAttribute('aria-expanded', 'false');
		delete trigger.dataset.open;
		trigger.querySelector('span').textContent = (trigger.id === 'm-country-trigger' || trigger.id === 'f-country-trigger' || trigger.id === 'a-country-trigger' || trigger.id === 'd-country-trigger') ? value : opt.textContent;
		trigger.dataset.filled = value ? '1' : '0';
		list.querySelectorAll('li').forEach(function(li) { li.setAttribute('aria-selected', 'false'); });
		opt.setAttribute('aria-selected', 'true');
		return;
	}
	if (e.target.closest('.appointment__custom-options')) return;
	var openList = document.querySelector('.appointment__custom-options[aria-hidden="false"]');
	if (openList) {
		var trig = document.getElementById(openList.id.replace('-list', '-trigger'));
		openList.setAttribute('aria-hidden', 'true');
		if (trig) { trig.setAttribute('aria-expanded', 'false'); delete trig.dataset.open; }
	}
});
document.addEventListener('change', function(e) {
		var sel = e.target.closest('.appointment__select');
		if (sel) {
			sel.dataset.filled = sel.value ? '1' : '0';
			sel.classList.remove('appointment__input--error');
			if (sel.id === 'm-country') {
				var display = sel.parentElement.querySelector('.appointment__code-display');
				if (display) display.textContent = sel.value;
			}
		}
		if (e.target.type === 'checkbox' && e.target.name === 'consent') {
			e.target.closest('.appointment__checkbox').style.color = '';
		}
	});
	document.addEventListener('input', function(e) {
		var el = e.target;
		if (el.classList.contains('appointment__input--error')) {
			el.classList.remove('appointment__input--error');
		}
		if (el.id === 'm-phone') {
			var digits = el.value.replace(/\D/g, '').slice(0, 10);
			var formatted = '';
			if (digits.length > 0) formatted = '(' + digits.slice(0, 3);
			if (digits.length > 3) formatted += ') ' + digits.slice(3, 6);
			if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
			if (digits.length > 8) formatted += '-' + digits.slice(8, 10);
			el.value = formatted;
		}
		if (el.matches('#m-lastname, #m-firstname, #m-patronymic')) {
			el.value = el.value.replace(/[0-9]/g, '');
		}
	});
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			var modal = document.querySelector('.modal[aria-hidden="false"]');
			if (modal) closeModal(modal);
		}
	});
	window.addEventListener('scroll', function() {
		if (document.querySelector('.appointment__custom-options[aria-hidden="false"]')) {
			closeAllCustomSelects();
		}
	});
	document.addEventListener('submit', function(e) {
		if (e.target.id !== 'appointment-form' && e.target.id !== 'doctor-appointment-form') return;
		e.preventDefault();
		var form = e.target;
		form.querySelectorAll('.appointment__input--error').forEach(function(el) {
			el.classList.remove('appointment__input--error');
		});
		form.querySelectorAll('.appointment__custom-select.appointment__input--error').forEach(function(el) {
			el.classList.remove('appointment__input--error');
		});
		var checkbox = form.querySelector('[name="consent"]');
		checkbox.closest('.appointment__checkbox').style.color = '';
		var valid = true;
		var firstError = null;
		var fields = form.querySelectorAll('[required]');
		for (var i = 0; i < fields.length; i++) {
			var f = fields[i];
			if (f.type === 'checkbox') {
				if (!f.checked) {
					valid = false;
					f.closest('.appointment__checkbox').style.color = '#d32f2f';
					if (!firstError) firstError = f;
				}
			} else if (!f.value.trim()) {
				valid = false;
				if (f.type === 'hidden') {
					var trig = document.getElementById(f.id + '-trigger');
					if (trig) trig.classList.add('appointment__input--error');
				} else {
					f.classList.add('appointment__input--error');
				}
				if (!firstError) firstError = f;
			}
		}
		var phone = form.querySelector('[name="phone"]');
		if (phone && phone.value.trim() && phone.value.replace(/\D/g, '').length < 7) {
			valid = false;
			phone.classList.add('appointment__input--error');
			if (!firstError) firstError = f;
		}
		if (!valid) {
			if (firstError) {
				if (firstError.type === 'checkbox') {
					firstError.closest('.appointment__checkbox').scrollIntoView({ behavior: 'smooth', block: 'center' });
				} else if (firstError.type === 'hidden') {
					var trig = document.getElementById(firstError.id + '-trigger');
					if (trig) {
						trig.focus({ preventScroll: true });
						trig.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}
				} else {
					firstError.focus({ preventScroll: true });
					firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}
			return;
		}
		var data = {};
		[].slice.call(form.querySelectorAll('[name]')).forEach(function(el) {
			if (el.type === 'checkbox') {
				data[el.name] = el.checked;
			} else {
				data[el.name] = el.value;
			}
		});
		var body = form.closest('.modal__body');
		if (body) {
			body.style.height = body.offsetHeight + 'px';
			body.style.overflow = 'hidden';
			body.style.display = 'flex';
			body.style.flexDirection = 'column';
		}
		form.style.display = 'none';
		var modal = form.closest('.modal');
		var success = modal.querySelector('.form-success');
		if (success) success.hidden = false;
		setTimeout(function() {
			if (success) success.classList.add('form-success--done');
		}, 1200);
		setTimeout(function() {
			if (modal) closeModal(modal);
		}, 3200);
});

function initChiefDoctorToggle() {
	document.addEventListener('click', function(e) {
		var btn = e.target.closest('.chief-doctor__more');
		if (!btn) return;
		var block = btn.closest('.chief-doctor__block');
		var extra = block.querySelector('.chief-doctor__extra');
		if (extra.hasAttribute('hidden')) {
			extra.removeAttribute('hidden');
			btn.textContent = 'Скрыть';
		} else {
			extra.setAttribute('hidden', '');
			btn.textContent = 'Еще';
		}
	});
}

function initFeedbackForm() {
	var feedbackForm = document.getElementById('feedback-form');
	var appealsForm = document.getElementById('appeals-form');
	if (!feedbackForm && !appealsForm) return;

	['feedback-form', 'appeals-form'].forEach(function(id) {
		var form = document.getElementById(id);
		if (!form) return;

		var phoneInput = form.querySelector('[name="phone"]');
		if (phoneInput) {
			phoneInput.addEventListener('input', function() {
				this.classList.remove('appointment__input--error');
				var digits = this.value.replace(/\D/g, '').slice(0, 10);
				var formatted = '';
				if (digits.length > 0) formatted = '(' + digits.slice(0, 3);
				if (digits.length > 3) formatted += ') ' + digits.slice(3, 6);
				if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
				if (digits.length > 8) formatted += '-' + digits.slice(8, 10);
				this.value = formatted;
			});
		}

		form.querySelectorAll('[name="firstname"], [name="lastname"], [name="patronymic"]').forEach(function(el) {
			el.addEventListener('input', function() {
				this.classList.remove('appointment__input--error');
				this.value = this.value.replace(/[0-9]/g, '');
			});
		});
	});

	document.addEventListener('submit', function(e) {
		var form = e.target;
		if (form.id !== 'feedback-form' && form.id !== 'appeals-form') return;
		e.preventDefault();

		form.querySelectorAll('.appointment__input--error').forEach(function(el) {
			el.classList.remove('appointment__input--error');
		});
		form.querySelectorAll('.appointment__custom-select.appointment__input--error').forEach(function(el) {
			el.classList.remove('appointment__input--error');
		});

		var checkbox = form.querySelector('[name="consent"]');
		var cbWrap = checkbox.closest('.appointment__checkbox');
		if (cbWrap) cbWrap.style.color = '';

		var valid = true;
		var firstError = null;
		var fields = form.querySelectorAll('[required]');
		for (var i = 0; i < fields.length; i++) {
			var f = fields[i];
			if (f.type === 'checkbox') {
				if (!f.checked) {
					valid = false;
					if (cbWrap) cbWrap.style.color = '#d32f2f';
					if (!firstError) firstError = f;
				}
			} else if (!f.value.trim()) {
				valid = false;
				if (f.type === 'hidden') {
					var trig = document.getElementById(f.id + '-trigger');
					if (trig) trig.classList.add('appointment__input--error');
				} else {
					f.classList.add('appointment__input--error');
				}
				if (!firstError) firstError = f;
			}
		}

		var phone = form.querySelector('[name="phone"]');
		if (phone && phone.value.trim() && phone.value.replace(/\D/g, '').length < 7) {
			valid = false;
			phone.classList.add('appointment__input--error');
			if (!firstError) firstError = phone;
		}

		if (!valid) {
			if (firstError) {
				if (firstError.type === 'checkbox') {
					firstError.closest('.appointment__checkbox').scrollIntoView({ behavior: 'smooth', block: 'center' });
				} else if (firstError.type === 'hidden') {
					var trig = document.getElementById(firstError.id + '-trigger');
					if (trig) {
						trig.focus({ preventScroll: true });
						trig.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}
				} else {
					firstError.focus({ preventScroll: true });
					firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}
			return;
		}

		if (form.id === 'feedback-form') {
			var body = form.closest('.modal__body');
			if (body) {
				body.style.height = body.offsetHeight + 'px';
				body.style.overflow = 'hidden';
				body.style.display = 'flex';
				body.style.flexDirection = 'column';
			}
		}
		form.style.display = 'none';
		var success = document.getElementById(form.id + '-success');
		if (success) success.hidden = false;
		setTimeout(function() {
			if (success) success.classList.add('form-success--done');
		}, 1200);
		setTimeout(function() {
			if (form.id === 'feedback-form') {
				var modal = form.closest('.modal');
				if (modal) closeModal(modal);
			} else {
				form.style.display = '';
				if (success) { success.hidden = true; success.classList.remove('form-success--done'); }
				form.querySelectorAll('.appointment__input--error').forEach(function(el) { el.classList.remove('appointment__input--error'); });
				if (cbWrap) cbWrap.style.color = '';
				form.reset();
			}
		}, 3200);
	});
}
