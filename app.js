const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ─── CURSOR GLOW (круг за мышкой) ───
const glow = $('#cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  if (glow) {
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ─── READING PROGRESS ───
const progressBar = $('#progressBar');
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}, { passive: true });

// ─── ACTIVE NAV ───
const sections = $$('section[id]');
const navLinks = $$('.header-nav a');

window.addEventListener('scroll', () => {
  let current = 'top';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').slice(1);
    link.classList.toggle('active', href === current);
  });
}, { passive: true });

// ─── SCROLL REVEAL ───
const revealEls = $$('.chapter, .timeline-item, .interview, .spot-detail, .figure-wide');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.06 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── ИНТЕРАКТИВ 1: Фильтр хронологии ───
const yearBtns = $$('[data-year]');
const timelineItems = $$('.timeline-item');

yearBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    yearBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const year = btn.dataset.year;

    timelineItems.forEach(item => {
      const match = year === 'all' || item.dataset.year === year;
      item.classList.toggle('dimmed', !match);
      item.classList.toggle('highlight', match && year !== 'all');
    });

    const label = year === 'all' ? 'Все годы' : year;
    toast(`Хронология: ${label}`);
  });
});

// ─── ИНТЕРАКТИВ 2: Карта конфликтов ───
const imgPath = (file) => new URL(`images/${file}`, document.baseURI).href;

const spotData = {
  stop: {
    img: imgPath('bus-stop.jpg'),
    title: 'Узкий тротуар у остановки',
    desc: 'Пешеходы выходят из автобуса. Самокатчик проносится в 10 см. Крики, мат, риск сбить ребёнка. Очаг напряжённости: высокая плотность людей + низкая предсказуемость движения.',
    danger: '🔴 Опасность: высокая'
  },
  crossing: {
    img: imgPath('crossing.png'),
    title: 'Пешеходный переход без светофора',
    desc: 'Водители машин пропускают людей. Самокатчики не пропускают никого — проскакивают на красный или между потоком. Самокат — ни рыба ни мясо: не пешеход, не машина, но везде хочет быть первым.',
    danger: '🔴 Опасность: высокая'
  },
  park: {
    img: imgPath('park.jpg'),
    title: 'Парк',
    desc: 'Место, где гуляют мамы с колясками и бегают дети. По паркам разрешено ездить медленно — 15 км/ч. Никто не ездит медленно. Итог: сбитые дети, сломанные коляски, вой сирен.',
    danger: '🟠 Опасность: средняя'
  },
  yard: {
    img: imgPath('yard.jpg'),
    title: 'Двор-колодец',
    desc: 'Узкие проезды между домами. Самокатчики срезают угол, пешеходы не видят их за углом. Столкновения — каждую неделю. Водители машин здесь тоже нервничают — самокаты вылетают из ниоткуда.',
    danger: '🔴 Опасность: высокая'
  },
  metro: {
    img: imgPath('metro.jpg'),
    title: 'Тротуар у станции метро',
    desc: 'Место стихийной парковки самокатов. Брошенные вповалку, они перекрывают путь инвалидам, мамам с колясками, пожилым. Компании обещают убирать, но «на место одного убранного приезжают три новых».',
    danger: '🟠 Опасность: средняя'
  }
};

function activateSpot(spot) {
  const data = spotData[spot];
  if (!data) return;

  $$('.hotspot').forEach(h => h.classList.toggle('active', h.dataset.spot === spot));
  $$('.spot-thumb').forEach(t => t.classList.toggle('active', t.dataset.spot === spot));

  const detail = $('#spotDetail');
  const img = $('#spotImg');
  const title = $('#spotTitle');
  const desc = $('#spotDesc');
  const danger = $('#spotDanger');

  if (img) { img.src = data.img; img.alt = data.title; }
  if (title) title.textContent = data.title;
  if (desc) desc.textContent = data.desc;
  if (danger) danger.textContent = data.danger;

  if (detail) {
    detail.classList.remove('flash');
    void detail.offsetWidth;
    detail.classList.add('flash');
  }

  toast(`📍 ${data.title}`);
}

$$('.hotspot').forEach(h => {
  h.addEventListener('click', () => activateSpot(h.dataset.spot));
});

$$('.spot-thumb').forEach(t => {
  t.addEventListener('click', () => activateSpot(t.dataset.spot));
});
