const fs = require('fs');
let html = fs.readFileSync('/Users/admin/Downloads/files/tongji_poster_machine.html', 'utf8');

const target = `document.querySelectorAll('[data-bg]').forEach(b => {
  b.addEventListener('click', () => {`;

const updated = `document.querySelectorAll('[data-logo]').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('[data-logo]').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    P.logo = b.dataset.logo;
  });
});
document.querySelectorAll('[data-bg]').forEach(b => {
  b.addEventListener('click', () => {`;

if (!html.includes("document.querySelectorAll('[data-logo]')")) {
  html = html.replace(target, updated);
  fs.writeFileSync('/Users/admin/Downloads/files/tongji_poster_machine.html', html);
  console.log("Fixed bindings!");
}
