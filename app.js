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
