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
function selectScenario(scenario) {
  document.querySelectorAll('[data-scenario]').forEach(button => {
    const selected = button.dataset.scenario === scenario;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('[data-view]').forEach(image => { image.hidden = image.dataset.view !== scenario; });
  document.querySelector('.scenario-description').textContent = scenario === 'room'
    ? 'Посмотрите жильё, узнайте будущего соседа и обсудите условия въезда.'
    : 'Найдите человека с похожими привычками и бюджетом. Жильё выберете вместе.';
  document.querySelector('.note-budget').innerHTML = scenario === 'room'
    ? '⌂ Комната и сосед<br><b>в одной анкете</b>' : '⌂ Сначала сосед.<br><b>Потом общий дом.</b>';
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
  document.querySelector('.board-status').textContent = votes === 2 ? 'Подходит обоим! Можно договориться о просмотре.' : votes === 1 ? 'Один голос есть. Осталось узнать мнение второго соседа.' : 'Нажмите за обоих соседей, чтобы выбрать общий вариант.';
}));
// Content stays visible without JavaScript or when reduced motion is enabled.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.scenario-card, .section-top, .housing-layout, .together, .steps article').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) { element.classList.add('reveal'); observer.observe(element); }
  });
}
