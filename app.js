// Replace null with verified official store URLs when the app is published.
const downloads = { 'App Store': null, 'Google Play': null };
const dialog = document.querySelector('#store-dialog');
document.querySelectorAll('[data-store]').forEach(button => {
  button.addEventListener('click', () => {
    const store = button.dataset.store;
    if (downloads[store]) { window.location.assign(downloads[store]); return; }
    document.querySelector('#store-message').textContent = `Matewise пока готовится к запуску в ${store}. Ссылка на скачивание появится здесь, когда приложение будет опубликовано.`;
    dialog.showModal();
  });
});
document.querySelectorAll('.dialog-close, .dialog-ok').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
const backToTop = document.querySelector('.back-to-top');
function updateBackToTop() { backToTop.hidden = window.scrollY < 480; }
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.querySelector('header .logo').focus({ preventScroll: true });
});
function selectScenario(scenario) {
  document.querySelectorAll('[data-scenario]').forEach(button => {
    const selected = button.dataset.scenario === scenario;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('[data-view]').forEach(image => { image.hidden = image.dataset.view !== scenario; });
  document.querySelector('.scenario-description').textContent = scenario === 'room'
    ? 'Посмотрите жильё, познакомьтесь со всеми жильцами и обсудите условия въезда.'
    : 'Найдите одного или нескольких соседей с похожими привычками и бюджетом. Жильё выберете вместе.';
}
document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => selectScenario(button.dataset.scenario)));
document.querySelectorAll('[data-pick]').forEach(button => button.addEventListener('click', () => {
  selectScenario(button.dataset.pick);
  document.querySelector('.hero').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));
document.querySelectorAll('[data-vote]').forEach(button => button.addEventListener('click', () => {
  const selected = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(selected));
  button.querySelector('span').textContent = selected ? '✓' : '+';
  const votes = document.querySelectorAll('[data-vote][aria-pressed="true"]').length;
  const total = document.querySelectorAll('[data-vote]').length;
  document.querySelector('.board-status').textContent = votes === total ? 'Подходит всем! Можно договориться о просмотре.' : votes > 0 ? `За этот вариант: ${votes} из ${total}. Дождитесь выбора остальных.` : 'Отметьте выбор каждого участника, чтобы найти общий вариант.';
}));
function updateGroupPreview() {
  const size = Number(document.querySelector('#group-size').value);
  const needed = Number(document.querySelector('#group-needed').value);
  const hasHousing = document.querySelector('[name="group-housing"]:checked').value === 'yes';
  const total = size + needed;
  const countLabel = number => `${number} ${number === 1 ? 'человек' : number < 5 ? 'человека' : 'человек'}`;
  const title = size === 1 ? `Ищу ${needed === 1 ? 'одного соседа' : 'двух соседей'}` : needed === 1 && size === 2 ? 'Нас двое — ищем третьего' : `Нас ${size === 2 ? 'двое' : 'трое'} — ищем ${needed === 1 ? 'ещё одного' : 'ещё двоих'}`;
  document.querySelector('.group-title').textContent = title;
  document.querySelector('.group-intent').textContent = hasHousing ? 'Приглашаем в готовое жильё' : 'Квартиру выбираем вместе';
  document.querySelector('.group-status').textContent = needed === 1 ? '1 место' : '2 места';
  document.querySelector('.group-total').textContent = countLabel(total);
  document.querySelector('.group-fact').textContent = hasHousing ? 'Фото жилья, личная доля аренды и правила' : 'Общий бюджет и районы поиска';
  const names = ['Анна', 'Марк', 'Алексей'];
  const members = document.querySelector('.group-members');
  members.replaceChildren();
  for (const name of names.slice(0, size)) {
    const member = document.createElement('span');
    const initial = document.createElement('i'); initial.textContent = name[0];
    member.append(initial, name); members.append(member);
  }
  for (let index = 0; index < needed; index++) {
    const vacancy = document.createElement('span'); vacancy.className = 'group-vacancy';
    const plus = document.createElement('i'); plus.textContent = '+';
    vacancy.append(plus, needed === 1 ? 'Ваше место' : 'Свободное место'); members.append(vacancy);
  }
}
document.querySelectorAll('#group-size, #group-needed, [name="group-housing"]').forEach(input => input.addEventListener('change', updateGroupPreview));
updateGroupPreview();
// Content stays visible without JavaScript or when reduced motion is enabled.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.scenario-card, .section-top, .housing-layout, .together, .steps article').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) { element.classList.add('reveal'); observer.observe(element); }
  });
}
