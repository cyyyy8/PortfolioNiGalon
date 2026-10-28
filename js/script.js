const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch { /* Storage may be blocked by browser privacy settings. */ }
if (savedTheme === 'light') body.classList.add('light');
function updateThemeLabel() {
  const light = body.classList.contains('light');
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle.title = light ? 'Switch to dark theme' : 'Switch to light theme';
}
updateThemeLabel();
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  try { localStorage.setItem('portfolio-theme', body.classList.contains('light') ? 'light' : 'dark'); } catch { /* Theme still works without persistence. */ }
  updateThemeLabel();
});

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.focus();
  }
});

const roles = ['Aspiring Network Engineer', 'Learning Network Administration', 'Growing Through Practice'];
const typed = document.getElementById('typed-role');
let roleIndex = 0, charIndex = roles[0].length, deleting = true;
function typeRole() {
  const phrase = roles[roleIndex];
  charIndex += deleting ? -1 : 1;
  typed.textContent = phrase.slice(0, charIndex);
  let delay = deleting ? 45 : 75;
  if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 300; }
  if (charIndex >= roles[roleIndex].length && !deleting) { deleting = true; delay = 1500; }
  window.setTimeout(typeRole, delay);
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) window.setTimeout(typeRole, 1800);

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.section, .hero-art').forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

const sections = [...document.querySelectorAll('main section[id]')];
const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  }
}), { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));

document.querySelector('.to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const toTop = document.querySelector('.to-top');
window.addEventListener('scroll', () => toTop.classList.toggle('visible', window.scrollY > 500), { passive: true });
document.getElementById('year').textContent = new Date().getFullYear();

const interviewVideo = document.getElementById('interview-video');
const interviewStatus = document.getElementById('interview-video-status');
interviewVideo.addEventListener('error', () => {
  interviewStatus.textContent = 'PLAYBACK ISSUE';
});
interviewVideo.addEventListener('loadedmetadata', () => {
  interviewStatus.textContent = 'VIDEO AVAILABLE';
});
// Empty project links stay inactive until a URL is added in index.html.
document.querySelectorAll('[data-project-link]').forEach(link => {
  if (!link.getAttribute('href').trim()) {
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
    link.title = 'Project URL coming soon';
    link.addEventListener('click', event => event.preventDefault());
  }
});
