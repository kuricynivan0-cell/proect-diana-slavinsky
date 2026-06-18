const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ─── CURSOR GLOW ───
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
const revealEls = $$('.chapter, .timeline-item, .interview, .hero-card, .world-card, .spot-detail, .figure-wide, .insight-box');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.06 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── ИНТЕРАКТИВ 1: Хронология ───
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

    toast(year === 'all' ? 'Вся хроника' : `Россия · ${year}`);
  });
});

// ─── ИНТЕРАКТИВ 2: Мировые кейсы ───
const worldData = {
  paris: {
    title: 'Париж: тротуар — только для пешеходов',
    year: '2021–2024',
    stat: '−35%',
    statLabel: 'травм с самокатами за 2 года',
    text: 'Мэр Ан Идальго запретила парковку кикшеринга на тротуарах и ввела 180 000 новых парковочных мест для велосипедов и самокатов — на проезжей части, в отведённых зонах. Самокаты не запрещали. Их просто «вытеснили» с тротуара физически — дали им место.',
    lesson: 'Не нужно выбирать между пешеходами и самокатами. Нужно решить, кому принадлежит тротуар — и дать самокатам альтернативу.'
  },
  oslo: {
    title: 'Осло: город без машин в центре',
    year: '2019–2024',
    stat: '0',
    statLabel: 'смертельных ДТП с пешеходами в центре за 2023',
    text: 'Осло к 2023 году фактически убрало автомобили из центра. Освободившееся пространство отдали пешеходам и микромобильности. Самокаты ездят по выделенным полосам — не потому что запретили тротуар, а потому что на дороге стало безопаснее, чем на асфальте для ног.',
    lesson: 'Когда машин меньше — самокатам не нужно лезть на тротуар. Конфликт решается перераспределением, а не запретом.'
  },
  copenhagen: {
    title: 'Копенгаген: 400 км дорожек — и самокаты встали в систему',
    year: '2018–2024',
    stat: '62%',
    statLabel: 'горожан ездят на велосипеде или самокате на работу',
    text: 'Когда в 2021 году пришёл кикшеринг, Копенгаген не паниковал: 400+ км велодорожек уже существовали. Самокаты интегрировали в ту же сеть. Операторы обязаны парковать только у станций. Результат: кикшеринг работает, тротуары чистые.',
    lesson: 'Инвестиции в инфраструктуру до кризиса — дешевле, чем борьба с последствиями после.'
  },
  singapore: {
    title: 'Сингапур: жёсткие зоны и штрафы, которые работают',
    year: '2020–2024',
    stat: '−70%',
    statLabel: 'жалоб на неправильную парковку за год',
    text: 'Land Transport Authority ввела GPS-зоны: самокат физически не поедет и не припаркуется вне разрешённой области. Штраф — до 2000 сингапурских долларов. Жёстко? Да. Но пешеходы перестали ненавидеть самокаты — потому что самокаты перестали мешать.',
    lesson: 'Технология регулирования работает — если штраф реальный, а зоны физически ограничены, а не «рекомендованы».'
  },
  barcelona: {
    title: 'Барселона: суперкварталы — машины снаружи, люди внутри',
    year: '2020–2025',
    stat: '−28%',
    statLabel: 'шума и выбросов CO₂ в пилотных кварталах',
    text: 'Проект «суперкварталов»: машины едут по периметру квартала, внутри — только пешеходы и медленная микромобильность (до 20 км/ч). Самокаты получили пространство. Пешеходы — тишину и безопасность. Конфликт исчез не из-за запрета, а из-за перекройки.',
    lesson: 'Один перекрой квартала меняет правила для тысяч людей — без единого запрета.'
  }
};

function activateCity(city) {
  const data = worldData[city];
  if (!data) return;

  $$('.world-btn').forEach(b => b.classList.toggle('active', b.dataset.city === city));

  const card = $('#worldCard');
  $('#worldTitle').textContent = data.title;
  $('#worldYear').textContent = data.year;
  $('#worldStat').textContent = data.stat;
  $('#worldStatLabel').textContent = data.statLabel;
  $('#worldText').textContent = data.text;
  $('#worldLesson').innerHTML = `<strong>Урок для России:</strong> ${data.lesson}`;

  if (card) {
    card.classList.remove('flash');
    void card.offsetWidth;
    card.classList.add('flash');
  }

  toast(data.title.split(':')[0]);
}

$$('.world-btn').forEach(btn => {
  btn.addEventListener('click', () => activateCity(btn.dataset.city));
});

// ─── Карта конфликтов (сравнение с миром) ───
const imgPath = (file) => new URL(`images/${file}`, document.baseURI).href;

const spotData = {
  stop: {
    img: imgPath('bus-stop.jpg'),
    title: 'Узкий тротуар у остановки',
    desc: 'Пешеходы выходят из автобуса — самокат в 10 см. В Копенгагене здесь велополоса между остановкой и дорогой. У нас — общий тротуар шириной 1,5 м.',
    danger: '🔴 У нас · 🟢 В Копенгагене решено'
  },
  crossing: {
    img: imgPath('crossing.png'),
    title: 'Пешеходный переход',
    desc: 'Самокаты проскакивают между пешеходами. В Осло переходы приподняты — самокат вынужден сбросить скорость. У нас — ровный асфальт и гонка.',
    danger: '🔴 У нас · 🟢 В Осло решено'
  },
  park: {
    img: imgPath('park.jpg'),
    title: 'Парк',
    desc: 'Дети, коляски, самокаты на 25 км/ч. В Барселоне внутри суперквартала — лимит 10 км/ч и отдельная дорожка. У нас — «езда разрешена, но медленно» (никто не соблюдает).',
    danger: '🔴 У нас · 🟢 В Барселоне решено'
  },
  yard: {
    img: imgPath('yard.jpg'),
    title: 'Двор-колодец',
    desc: 'Самокат вылетает из-за угла. В Париже дворы закрыты для транзитного движения — самокат физически не может срезать. У нас — открытый двор и столкновения каждую неделю.',
    danger: '🔴 У нас · 🟢 В Париже решено'
  },
  metro: {
    img: imgPath('metro.jpg'),
    title: 'У станции метро',
    desc: 'Стихийная парковка перекрывает путь. В Сингапуре GPS не даст припарковать самокат вне зоны. У нас — штраф 500 ₽, который никто не боится.',
    danger: '🔴 У нас · 🟢 В Сингапуре решено'
  }
};

function activateSpot(spot) {
  const data = spotData[spot];
  if (!data) return;

  $$('.hotspot').forEach(h => h.classList.toggle('active', h.dataset.spot === spot));
  $$('.spot-thumb').forEach(t => t.classList.toggle('active', t.dataset.spot === spot));

  const img = $('#spotImg');
  if (img) { img.src = data.img; img.alt = data.title; }
  $('#spotTitle').textContent = data.title;
  $('#spotDesc').textContent = data.desc;
  $('#spotDanger').textContent = data.danger;

  const detail = $('#spotDetail');
  if (detail) {
    detail.classList.remove('flash');
    void detail.offsetWidth;
    detail.classList.add('flash');
  }
}

$$('.hotspot').forEach(h => {
  h.addEventListener('click', () => activateSpot(h.dataset.spot));
});

$$('.spot-thumb').forEach(t => {
  t.addEventListener('click', () => activateSpot(t.dataset.spot));
});
