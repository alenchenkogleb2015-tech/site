const fs = require('fs');
const path = require('path');

const LOCATIONS = [
  'Расписание приема Амбулатория п. Волочаевка 2',
  'Расписание приема Амбулатория п. Приамурский',
  'Расписание приема Детская поликлиника п. Николаевка',
  'Расписание приема Николаевская районная больница',
  'Расписание приема ФАП с. Даниловка',
  'Расписание приема ФАП с. Камышовка',
  'Расписание приема ФАП с. Ключевое',
  'Расписание приема ФАП с. Соцгородок',
  'Расписание приема ФАП с. им. Тельман',
];

const DOCTORS = [
  'Книжникова Татьяна Евгеньевна',
  'Сылко Татьяна Викторовна',
  'Храмова Людмила Викторовна',
];

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

function dayCard(name, weekend) {
  const badgeClass = weekend ? 'schedule-day__badge--off' : 'schedule-day__badge--work';
  const badgeText = weekend ? 'Выходной' : '8:00-18:00';
  return (
    '\t\t\t\t\t\t\t\t<div class="schedule-day">\n' +
    `\t\t\t\t\t\t\t\t\t<span class="schedule-day__name">${name}</span>\n` +
    `\t\t\t\t\t\t\t\t\t<span class="schedule-day__badge ${badgeClass}">${badgeText}</span>\n` +
    '\t\t\t\t\t\t\t\t</div>'
  );
}

function weekGrid() {
  const cards = DAYS.map((name, index) => dayCard(name, index >= 5)).join('\n');
  return `\t\t\t\t\t\t\t<div class="schedule-week">\n${cards}\n\t\t\t\t\t\t\t</div>`;
}

function doctorsBlock() {
  return DOCTORS.map(
    (name) =>
      '\t\t\t\t\t\t\t<details class="schedule-doctor">\n' +
      `\t\t\t\t\t\t\t\t<summary class="schedule-doctor__summary">${name}</summary>\n` +
      '\t\t\t\t\t\t\t\t<div class="schedule-doctor__panel">\n' +
      `${weekGrid()}\n` +
      '\t\t\t\t\t\t\t\t</div>\n' +
      '\t\t\t\t\t\t\t</details>'
  ).join('\n');
}

function groupBlock() {
  return (
    '\t\t\t\t\t\t\t<details class="schedule-group">\n' +
    '\t\t\t\t\t\t\t\t<summary class="schedule-group__head">\n' +
    '\t\t\t\t\t\t\t\t\t<span class="schedule-group__left">ВРАЧ ТЕРАПЕВТ</span>\n' +
    '\t\t\t\t\t\t\t\t\t<span class="schedule-group__right">3 ВРАЧА</span>\n' +
    '\t\t\t\t\t\t\t\t</summary>\n' +
    '\t\t\t\t\t\t\t\t<div class="schedule-group__body">\n' +
    `${doctorsBlock()}\n` +
    '\t\t\t\t\t\t\t\t</div>\n' +
    '\t\t\t\t\t\t\t</details>'
  );
}

function locationBlock(title) {
  const groups = Array.from({ length: 7 }, () => groupBlock()).join('\n');
  return (
    '\t\t\t\t\t<details class="schedule-location">\n' +
    `\t\t\t\t\t\t<summary class="schedule-location__summary">${title}</summary>\n` +
    '\t\t\t\t\t\t<div class="schedule-location__panel">\n' +
    `${groups}\n` +
    '\t\t\t\t\t\t</div>\n' +
    '\t\t\t\t\t</details>'
  );
}

const html =
  '\t\t\t\t<div class="schedule-accordion">\n' +
  `${LOCATIONS.map(locationBlock).join('\n')}\n` +
  '\t\t\t\t</div>';

fs.writeFileSync(path.join(__dirname, 'schedule_accordion.html'), html, 'utf8');
console.log('written', html.length);
