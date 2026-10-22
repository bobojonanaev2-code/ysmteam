'use strict';

(function () {
  var img = function (id, width) {
    return 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + (width || 1100) + '&q=78';
  };
  var sites = {
    atelier: {
      theme: 'atelier', brand: 'ATELIER <i>NO. 08</i>', nav: [['Коллекция', '#collection'], ['История', '#story'], ['Журнал', '#journal']],
      eyebrow: 'Коллекция  /  Осень — зима 2026', title: 'Новая форма<br>привычных вещей.',
      intro: 'Гардероб для тех, кто выбирает меньше, но точнее. Спокойные силуэты, честные материалы и внимание к деталям.',
      action: 'Открыть коллекцию', hero: 'photo-1490481651871-ab68de25d43d',
      titleFont: 'editorial',
      products: [
        ['photo-1441986300917-64674bd600d8', 'Пальто «Север»', 'Шерсть мериноса · графит', '48 900 ₽', 'Новинка'],
        ['photo-1555066931-4365d14bab8c', 'Сумка «Форма 02»', 'Натуральная кожа · коньяк', '24 500 ₽', 'Бестселлер'],
        ['photo-1522071820081-009f0129c71c', 'Рубашка «Линия»', 'Хлопок · молочный', '12 800 ₽', 'Лимитировано'],
        ['photo-1547658719-da2b51169166', 'Брюки «Тихо»', 'Лён · тёплый серый', '17 900 ₽', 'Новинка']
      ],
      stories: [
        ['photo-1600607687939-ce8a6c25118c', 'Материал имеет значение', 'Работаем с небольшими мастерскими и выбираем ткани, которые красиво стареют.'],
        ['photo-1553877522-43269d4ea984', 'Вещь надолго', 'Каждый силуэт задуман так, чтобы остаться в гардеробе за пределами одного сезона.'],
        ['photo-1551434678-e076c223a692', 'Сделано рядом', 'Небольшие тиражи и производство, которое можно назвать по имени.']
      ]
    },
    travel: {
      theme: 'travel', brand: 'NORTH <i>/ 62°</i>', nav: [['Места', '#places'], ['Маршрут', '#route'], ['О нас', '#about']],
      eyebrow: 'Авторские путешествия · 2026', title: 'Дальше только<br>тишина.',
      intro: 'Небольшие экспедиции к местам, где можно выдохнуть. Всё уже продумано: маршрут, дом и люди рядом.',
      action: 'Выбрать направление', hero: 'photo-1500530855697-b586d89ba3ee',
      places: [
        ['photo-1451187580459-43490279c0fa', 'Кольский полуостров', '4 дня · группа до 8 человек', 'от 48 000 ₽'],
        ['photo-1518005020951-eccb494ad742', 'Алтайские тропы', '6 дней · группа до 10 человек', 'от 72 000 ₽'],
        ['photo-1497366754035-f200968a6e72', 'Берег Белого моря', '3 дня · группа до 6 человек', 'от 39 000 ₽']
      ]
    },
    finance: {
      theme: 'finance', brand: 'FORMA <i>CAPITAL</i>', nav: [['Платформа', '#platform'], ['Как работает', '#how'], ['Безопасность', '#security']],
      eyebrow: 'Инвестиции без лишнего шума', title: 'Деньги должны<br>двигаться.',
      intro: 'Инструменты и аналитика, которые помогают принимать взвешенные решения. Весь портфель — в ясном контексте.',
      action: 'Посмотреть платформу', hero: 'photo-1639762681485-074b7f938ba0',
      metrics: [['12,8%', 'средний рост портфелей'], ['40+', 'рынков в одном окне'], ['24/7', 'контроль активов']],
      features: [
        ['01', 'Ваш портфель', 'Все активы в одном месте, с понятной динамикой и историей изменений.'],
        ['02', 'Рынок сегодня', 'Важное за день собрано в короткие обзоры без рекламного шума.'],
        ['03', 'План на завтра', 'Настраивайте цели и следите за прогрессом в удобном темпе.']
      ]
    },
    restaurant: {
      theme: 'restaurant', brand: 'MISO <i>IZAKAYA</i>', nav: [['Меню', '#menu'], ['Философия', '#story'], ['Найти нас', '#visit']],
      eyebrow: 'Японская кухня · Москва', title: 'Вкус момента.<br>Без спешки.',
      intro: 'Тёплый свет, сезонные продукты и кухня, открытая залу. Приходите поужинать — останьтесь на ещё один чай.',
      action: 'Забронировать стол', hero: 'photo-1414235077428-338989a2e8c0',
      dishes: [
        ['photo-1565299624946-b28f40a0ae38', 'Татаки из тунца', 'Понзу, огурец, хрустящий рис', '890 ₽'],
        ['photo-1559847844-5315695dadae', 'Рамен с уткой', 'Домашний бульон, лапша, зелень', '1 090 ₽'],
        ['photo-1476224203421-9ac39bcb3327', 'Моти с юдзу', 'Белый шоколад, цитрусовый крем', '490 ₽']
      ],
      plates: [
        ['Идзакая-салат', 'Хрустящий баклажан, томат, мисо', '690 ₽'],
        ['Гёдза с креветкой', 'Шесть штук, острый соус, лайм', '790 ₽'],
        ['Лосось на углях', 'Рис, молодой лук, кунжутное масло', '1 490 ₽'],
        ['Матча-тирамису', 'Матча, маскарпоне, рассыпчатое печенье', '620 ₽']
      ]
    },
    architecture: {
      theme: 'architecture', brand: 'FORMA <i> / ARCH</i>', nav: [['Проекты', '#projects'], ['Бюро', '#studio'], ['Подход', '#approach']],
      eyebrow: 'Архитектурное бюро · Москва / везде', title: 'Пространство<br>для жизни.',
      intro: 'Дома, в которых хочется остаться. Проектируем архитектуру и интерьеры, начиная с привычек тех, кто будет в них жить.',
      action: 'Смотреть проекты', hero: 'photo-1600607687939-ce8a6c25118c',
      projects: [
        ['photo-1486406146926-c627a92ad1ab', 'Дом у воды', 'Частная резиденция · Карелия · 2025'],
        ['photo-1451187580459-43490279c0fa', 'Лесная резиденция', 'Дом выходного дня · Алтай · 2024'],
        ['photo-1523726491678-bf852e717f6a', 'Свет и воздух', 'Квартира · Москва · 2026']
      ]
    },
    wellness: {
      theme: 'wellness', brand: 'SOMA <i> / CLUB</i>', nav: [['Практики', '#practices'], ['Расписание', '#schedule'], ['Клуб', '#club']],
      eyebrow: 'Пространство движения и восстановления', title: 'Вернуться<br>к себе.',
      intro: 'Практики, которые помогают услышать собственный ритм. Небольшие группы, внимательные наставники, бережный подход.',
      action: 'Найти свою практику', hero: 'photo-1545205597-3d9d02c29597',
      practices: [
        ['01', 'Йога', 'Мягкая сила и внимание к дыханию.', 'от 900 ₽'],
        ['02', 'Пилатес', 'Сильный центр и точное движение.', 'от 1 100 ₽'],
        ['03', 'Медитация', 'Тишина, которая помогает собраться.', 'от 700 ₽']
      ],
      coaches: [
        ['photo-1522071820081-009f0129c71c', 'Анна Лебедева', 'Йога · 8 лет практики'],
        ['photo-1551434678-e076c223a692', 'Марк Смирнов', 'Пилатес · реабилитация']
      ]
    },
    orion: {
      theme: 'orion', brand: 'ORION <i> / DESIGN SYSTEM</i>', nav: [['Система', '#system'], ['Компоненты', '#components'], ['Принципы', '#principles']],
      eyebrow: 'Дизайн-система для цифровых команд', title: 'Цельность<br>в каждой детали.',
      intro: 'Открытая библиотека компонентов, правил и паттернов, чтобы продукт рос быстрее и оставался собой.',
      action: 'Изучить систему', hero: 'photo-1561070791-2526d30994b5'
    }
  };

  var projectMap = {
    finance: 'finance', commerce: 'atelier', saas: 'finance',
    architecture: 'architecture', data: 'finance', orion: 'orion'
  };
  var params = new URLSearchParams(window.location.search);
  var isProject = params.has('project');
  var requested = isProject ? (projectMap[params.get('project')] || 'finance') : (params.get('site') || 'atelier');
  var site = sites[requested] || sites.atelier;
  var projectTitles = {
    finance: ['Финансовая аналитика', 'FinTech · 2026'], commerce: ['Премиум E-Commerce', 'Retail · 2025'],
    saas: ['SaaS-платформа', 'B2B · 2025'], architecture: ['Архитектурное бюро', 'Brand · 2024'],
    data: ['Аналитика Big Data', 'Data · 2026'], orion: ['Дизайн-система Orion', 'UI/UX · 2025']
  };
  var title = isProject ? projectTitles[params.get('project')] || projectTitles.finance : null;
  var projectDetails = {
    saas: { brand: 'NEXUS <i>WORKSPACE</i>', eyebrow: 'Пространство для слаженной работы', intro: 'Проекты, задачи и команда в одном рабочем пространстве. Меньше переключений — больше времени на важное.', metrics: [['68%', 'меньше ручных сверок'], ['4,2 ч', 'высвобождается в неделю'], ['1', 'пространство команды']], features: [['01', 'Проекты', 'Общая картина по задачам, срокам и ответственным — без разрозненных таблиц.'], ['02', 'Команда', 'Понятная загрузка и контекст для каждого участника.'], ['03', 'Автоматизация', 'Рутинные действия запускаются по простым правилам.']] },
    data: { brand: 'SIGNAL <i>DATA</i>', eyebrow: 'Аналитика, которая замечает главное', intro: 'Собирайте сигналы из разных источников и превращайте сложный набор показателей в ясные решения.', metrics: [['+18%', 'рост выручки клиентов'], ['12 млн', 'событий в сутки'], ['−34%', 'время на отчёт']], features: [['01', 'Показатели', 'Собирайте ключевые метрики в одном понятном обзоре.'], ['02', 'Сигналы', 'Замечайте изменения до того, как они станут проблемой.'], ['03', 'Решения', 'Обсуждайте выводы вместе с командой и сохраняйте контекст.']] }
  };
  if (isProject && projectDetails[params.get('project')]) Object.assign(site, projectDetails[params.get('project')]);
  var root = document.getElementById('preview-root');

  function header() {
    var back = isProject ? 'portfolio.html' : 'index.html#website-examples';
    var backText = isProject ? 'Все проекты' : 'В студию';
    return '<header class="site-nav"><a class="site-logo" href="#top">' + site.brand + '</a><nav>' + site.nav.map(function (n) { return '<a href="' + n[1] + '">' + n[0] + '</a>'; }).join('') + '</nav><a class="site-return" href="' + back + '">↖ <span>' + backText + '</span></a></header>';
  }
  function footer() {
    return '<footer class="site-footer"><a class="site-logo" href="#top">' + site.brand + '</a><span>ДИЗАЙН / DIGITAL / 2026</span><a href="' + (isProject ? 'portfolio.html' : 'index.html#website-examples') + '">← CyberCraft</a></footer>';
  }
  function hero() {
    var heroTitle = title ? (title[0] + '.') : site.title;
    var heroImage = isProject ? ({
      finance: 'photo-1611974789855-9c2a0a7236a3', commerce: 'photo-1441986300917-64674bd600d8',
      saas: 'photo-1551288049-bebda4e38f71', architecture: 'photo-1600607687939-ce8a6c25118c',
      data: 'photo-1460925895917-afdab827c52f', orion: 'photo-1561070791-2526d30994b5'
    })[params.get('project')] : site.hero;
    var sub = title ? (title[1] + ' / Концепт цифрового продукта') : site.eyebrow;
    var desc = title ? 'Самостоятельная визуальная концепция CyberCraft: стратегия, интерфейс и цифровой опыт для проекта «' + title[0] + '».' : site.intro;
    var action = title ? 'Обсудить похожий проект' : site.action;
    return '<section class="site-hero" id="top"><div class="hero-photo" style="--hero:url(' + "'" + img(heroImage, 1800) + "'" + ')"></div><div class="hero-shade"></div><div class="hero-meta"><span>' + sub + '</span><span>МОСКВА · 2026</span></div><div class="hero-copy"><p class="site-kicker">' + site.eyebrow + '</p><h1>' + heroTitle + '</h1><p class="hero-intro">' + desc + '</p><a class="site-button" href="#' + (site.theme === 'restaurant' ? 'visit' : site.theme === 'travel' ? 'places' : site.theme === 'wellness' ? 'practices' : site.theme === 'atelier' ? 'collection' : site.theme === 'architecture' ? 'projects' : 'platform') + '">' + action + '<span>↗</span></a></div><div class="hero-foot"><span>ПРОДУМАНО ДО МЕЛОЧЕЙ</span><a href="#content-start">ЛИСТАЙТЕ НИЖЕ ↓</a></div></section>';
  }
  function pageTitle(eyebrow, heading, copy) {
    return '<div class="section-title"><p class="site-kicker">' + eyebrow + '</p><h2>' + heading + '</h2>' + (copy ? '<p>' + copy + '</p>' : '') + '</div>';
  }
  function fashion() {
    var items = site.products;
    return '<div class="brand-strip"><span>ОДЕЖДА СВОБОДНОГО РИТМА</span><span>СОЗДАНО В МОСКВЕ · НОШЕНО ВЕЗДЕ</span><span>ОДЕЖДА СВОБОДНОГО РИТМА</span></div>' +
      '<section class="site-section" id="collection">' + pageTitle('01 / Коллекция', 'Носить. Чувствовать. Оставить.', 'Капсульные вещи, которые становятся частью вашего повседневного маршрута.') +
      '<div class="shop-tools"><span>12 вещей / Осень — зима</span><div><button class="filter-chip is-active" data-filter="all">Все</button><button class="filter-chip" data-filter="coat">Верхняя одежда</button><button class="filter-chip" data-filter="everyday">На каждый день</button></div></div>' +
      '<div class="product-grid">' + items.map(function (p, i) { return '<article class="product-card" data-kind="' + (i === 0 ? 'coat' : 'everyday') + '"><div class="product-img"><img loading="lazy" src="' + img(p[0]) + '" alt="' + p[1] + '"><span>' + p[4] + '</span><button class="quick-add" aria-label="Добавить ' + p[1] + '">+</button></div><div class="product-info"><div><h3>' + p[1] + '</h3><p>' + p[2] + '</p></div><b>' + p[3] + '</b></div></article>'; }).join('') + '</div></section>' +
      '<section class="atelier-story" id="story"><div class="story-image"><img loading="lazy" src="' + img('photo-1600607687939-ce8a6c25118c', 1400) + '" alt="Светлая мастерская Atelier No. 08"></div><div class="story-copy"><p class="site-kicker">Наша философия</p><h2>Хороший дизайн<br>не просит внимания.</h2><p>Он просто остаётся рядом. Мы создаём одежду, где форма не спорит с человеком, а помогает ему быть собой.</p><a class="text-link" href="#journal">История бренда <span>↗</span></a></div></section>' +
      '<section class="site-section" id="journal">' + pageTitle('02 / Дневник', 'Небольшие истории.', 'О тканях, мастерских и людях, чья работа чувствуется в каждой вещи.') + '<div class="story-grid">' + site.stories.map(function (s) { return '<article class="story-card"><img loading="lazy" src="' + img(s[0], 850) + '" alt=""><p class="site-kicker">Материал / Люди / Место</p><h3>' + s[1] + '</h3><p>' + s[2] + '</p><a href="#contact" class="text-link">Читать заметку ↗</a></article>'; }).join('') + '</div></section>' +
      '<section class="closing-panel" id="contact"><p class="site-kicker">Ограниченный тираж</p><h2>Найдите свою<br>вещь.</h2><a class="site-button" href="mailto:hello@cybercraft.studio">Записаться в шоурум <span>↗</span></a></section>';
  }
  function travel() {
    return '<section class="site-section travel-section" id="places">' + pageTitle('01 / Выберите своё место', 'Маршруты, которые остаются с вами.', 'Идём в комфортном темпе: небольшая компания, локальные проводники и время просто быть на месте.') + '<div class="destination-grid">' + site.places.map(function (p, i) { return '<article class="destination-card"><img loading="lazy" src="' + img(p[0], 1100) + '" alt="' + p[1] + '"><div class="destination-number">0' + (i + 1) + ' / 03</div><div class="destination-copy"><span>' + p[2] + '</span><h3>' + p[1] + '</h3><div><b>' + p[3] + '</b><a href="#route" aria-label="Узнать о маршруте">↗</a></div></div></article>'; }).join('') + '</div></section>' +
      '<section class="route-section" id="route"><div class="route-intro">' + pageTitle('02 / Как всё устроено', 'Продумано. Но не расписано по минутам.', 'Мы берём на себя логистику и быт, чтобы у вас оставалось время на само путешествие.') + '<p class="route-note">«Самое ценное в дороге — не галочка напротив места. Это утро, которое вы захотите повторить».</p></div><div class="route-steps"><article><span>ДЕНЬ 01</span><h3>Оставить город</h3><p>Встречаемся, знакомимся и доезжаем до первого места без спешки.</p></article><article><span>ДЕНЬ 02</span><h3>Пойти своей тропой</h3><p>День на воздухе: маршрут выбираем по погоде и состоянию группы.</p></article><article><span>ДЕНЬ 03</span><h3>Забрать с собой</h3><p>Медленный завтрак, ещё один взгляд на горизонт и дорога домой.</p></article></div></section>' +
      '<section class="travel-note" id="about"><img loading="lazy" src="' + img('photo-1451187580459-43490279c0fa', 1400) + '" alt="Горный пейзаж на рассвете"><div><p class="site-kicker">Маленькая группа. Большое небо.</p><h2>Не тур.<br>Общее воспоминание.</h2><p>Мы ездим вместе уже семь лет и сохраняем размер группы до десяти человек. Так у каждого остаётся место и для компании, и для тишины.</p><a class="site-button" href="#contact">Спросить организатора <span>↗</span></a></div></section>' +
      '<section class="closing-panel" id="contact"><p class="site-kicker">Следующий выезд — 18 июля</p><h2>Пора выбрать<br>своё направление.</h2><a class="site-button" href="mailto:hello@cybercraft.studio">Подобрать поездку <span>↗</span></a></section>';
  }
  function finance() {
    return '<section class="finance-overview" id="platform"><div class="overview-heading">' + pageTitle('01 / Панель инвестора', 'Вся картина. Одним взглядом.', 'Инструменты для долгосрочных решений и уверенного ежедневного контроля.') + '<a class="outline-button" href="#how">Как это работает ↘</a></div><div class="dashboard"><div class="dash-top"><span>МОЙ ПОРТФЕЛЬ <i>● ДАННЫЕ ОБНОВЛЕНЫ</i></span><span>₽ RUB　⌄</span></div><div class="dash-value"><div><small>Общая стоимость</small><b>₽ 2 480 600</b><em>↗ 8,42% за год</em></div><div class="dash-period"><button>1м</button><button>3м</button><button class="is-active">1г</button><button>Всё</button></div></div><div class="chart-wrap"><div class="chart-labels"><span>2,5 млн</span><span>2,0 млн</span><span>1,5 млн</span><span>1,0 млн</span></div><svg class="portfolio-chart" viewBox="0 0 760 220" preserveAspectRatio="none" aria-label="График роста портфеля"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#49b994" stop-opacity=".22"/><stop offset="1" stop-color="#49b994" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="M0 185 C45 164 56 176 94 148 S151 156 190 128 S242 144 286 107 S350 128 389 95 S450 112 489 70 S550 99 588 66 S653 76 687 40 S731 54 760 20 V220 H0Z"/><path class="chart-line" d="M0 185 C45 164 56 176 94 148 S151 156 190 128 S242 144 286 107 S350 128 389 95 S450 112 489 70 S550 99 588 66 S653 76 687 40 S731 54 760 20"/></svg></div><div class="dash-assets"><span>Активы в портфеле</span><span>Доля</span><b>Фонды рынка</b><span>46%</span><b>Облигации</b><span>32%</span><b>Акции компаний</b><span>22%</span></div></div><div class="metric-row">' + site.metrics.map(function (m) { return '<article><b>' + m[0] + '</b><span>' + m[1] + '</span></article>'; }).join('') + '</div></section>' +
      '<section class="site-section" id="how">' + pageTitle('02 / Всё по полочкам', 'Спокойствие — тоже стратегия.', 'Вместо сложных терминов — ясные инструменты, которые помогают думать на перспективу.') + '<div class="feature-grid">' + site.features.map(function (f) { return '<article class="feature-card"><span>' + f[0] + ' / FORMA</span><h3>' + f[1] + '</h3><p>' + f[2] + '</p><a href="#security">Узнать больше ↗</a></article>'; }).join('') + '</div></section>' +
      '<section class="security-band" id="security"><div class="security-mark">✓</div><div><p class="site-kicker">Спокойствие в деталях</p><h2>Безопасность<br>в основе каждого шага.</h2><p>Защита данных, контроль доступа и прозрачная история операций. Всё важное можно проверить самостоятельно.</p></div><div class="security-facts"><span><b>01</b> Данные зашифрованы</span><span><b>02</b> Вход с подтверждением</span><span><b>03</b> История без пробелов</span></div></section>' +
      '<section class="closing-panel" id="contact"><p class="site-kicker">Начните в своём темпе</p><h2>Ясность в каждом<br>решении.</h2><a class="site-button" href="mailto:hello@cybercraft.studio">Создать аккаунт <span>↗</span></a></section>';
  }
  function restaurant() {
    return '<section class="site-section" id="menu">' + pageTitle('01 / Сейчас на столе', 'Сезонное меню.', 'Кухня, которая меняется вместе с рынком, погодой и настроением повара.') + '<div class="dish-grid">' + site.dishes.map(function (d) { return '<article class="dish-card"><img loading="lazy" src="' + img(d[0], 900) + '" alt="' + d[1] + '"><div class="dish-copy"><div><h3>' + d[1] + '</h3><p>' + d[2] + '</p></div><b>' + d[3] + '</b></div></article>'; }).join('') + '</div><a href="#visit" class="text-link menu-link">Смотреть полное меню <span>↗</span></a></section>' +
      '<section class="restaurant-story" id="story"><div class="restaurant-photo"><img loading="lazy" src="' + img('photo-1553877522-43269d4ea984', 1300) + '" alt="Команда Miso готовит ужин"></div><div class="restaurant-copy"><p class="site-kicker">Знакомство с Miso</p><h2>Место для долгого вечера.</h2><p>Мы открыли идзакая, куда сами хотели бы приходить после насыщенного дня. Здесь можно разделить несколько блюд, встретить друзей и не смотреть на часы.</p><p>Продукты привозим каждый день, соусы готовим сами, а меню печатаем заново, когда на рынке появляется что-то особенно хорошее.</p><a class="text-link" href="#visit">Немного о нас <span>↗</span></a></div></section>' +
      '<section class="site-section menu-list-section">' + pageTitle('02 / Основное меню', 'Ещё кое-что к вашему столу.', 'Честная еда для вечера, который не хочется заканчивать.') + '<div class="menu-list">' + site.plates.map(function (d, i) { return '<article><span>0' + (i + 1) + '</span><div><h3>' + d[0] + '</h3><p>' + d[1] + '</p></div><b>' + d[2] + '</b></article>'; }).join('') + '</div></section>' +
      '<section class="reservation" id="visit"><div class="reservation-copy"><p class="site-kicker">На сегодня осталось 4 стола</p><h2>Мы будем ждать.</h2><p>Каждый день, с 12:00 до 23:00<br>Пятница и суббота — до 01:00</p><a href="https://maps.google.com/?q=Moscow" target="_blank" rel="noreferrer" class="text-link">Москва, Большая Никитская, 22 <span>↗</span></a></div><form class="demo-form"><label>Ваше имя<input required name="name" placeholder="Как к вам обращаться"></label><label>Телефон<input required type="tel" name="phone" placeholder="+7 ___ ___-__-__"></label><div class="form-row"><label>Гостей<select><option>2 человека</option><option>3 человека</option><option>4 человека</option><option>5 человек</option></select></label><label>Время<select><option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option></select></label></div><button class="site-button" type="submit">Запросить стол <span>↗</span></button><p class="form-status" aria-live="polite"></p></form></section>';
  }
  function architecture() {
    return '<section class="site-section architecture-projects" id="projects">' + pageTitle('01 / Избранные проекты', 'Место задаёт ритм.', 'Работаем с окружением, привычками и временем — не только с планировкой.') + '<div class="architecture-grid">' + site.projects.map(function (p, i) { return '<a class="architecture-card arch-' + (i + 1) + '" href="#approach"><div class="arch-img"><img loading="lazy" src="' + img(p[0], 1200) + '" alt="' + p[1] + '"><span>0' + (i + 1) + '</span></div><div class="arch-caption"><h3>' + p[1] + '</h3><p>' + p[2] + '</p><span>↗</span></div></a>'; }).join('') + '</div></section>' +
      '<section class="architecture-manifesto" id="studio"><img loading="lazy" src="' + img('photo-1486406146926-c627a92ad1ab', 1500) + '" alt="Архитектура и городская среда"><div><p class="site-kicker">Бюро FORMA</p><h2>Архитектура начинается с вопроса: как здесь будет жить человек?</h2><p>Изучаем участок, свет, материалы и ваш повседневный сценарий. Так появляются проекты, которые остаются близкими годами.</p></div></section>' +
      '<section class="site-section process-section" id="approach">' + pageTitle('02 / Наш подход', 'Четыре шага к своему месту.', 'Открытый процесс, в котором заказчик понимает, что происходит на каждом этапе.') + '<div class="arch-steps"><article><span>01 — ПОГРУЖЕНИЕ</span><h3>Слушаем</h3><p>Знакомимся с вами, местом и задачами будущего пространства.</p></article><article><span>02 — КОНЦЕПЦИЯ</span><h3>Ищем форму</h3><p>Показываем несколько ясных направлений и вместе выбираем главное.</p></article><article><span>03 — ПРОЕКТ</span><h3>Продумываем</h3><p>Собираем чертежи, материалы и детали в стройную систему.</p></article><article><span>04 — РЕАЛИЗАЦИЯ</span><h3>Остаёмся рядом</h3><p>Помогаем проекту стать местом, в которое хочется возвращаться.</p></article></div></section>' +
      '<section class="closing-panel" id="contact"><p class="site-kicker">Ваше место начинается с разговора</p><h2>Расскажите,<br>как вы живёте.</h2><a class="site-button" href="mailto:hello@cybercraft.studio">Обсудить проект <span>↗</span></a></section>';
  }
  function wellness() {
    return '<section class="site-section" id="practices">' + pageTitle('01 / Практики', 'Выберите то, что сейчас нужно.', 'Никаких достижений и сравнений — только время, которое вы уделяете себе.') + '<div class="practice-grid">' + site.practices.map(function (p) { return '<article class="practice-card"><span class="practice-no">' + p[0] + '</span><div><h3>' + p[1] + '</h3><p>' + p[2] + '</p><b>' + p[3] + ' / занятие</b></div><a href="#schedule">↗</a></article>'; }).join('') + '</div></section>' +
      '<section class="wellness-quote"><p>«Не нужно торопиться, чтобы прийти к себе».</p><span>— SOMA CLUB</span><img loading="lazy" src="' + img('photo-1545205597-3d9d02c29597', 1500) + '" alt="Зал для практик в мягком утреннем свете"></section>' +
      '<section class="schedule-section" id="schedule">' + pageTitle('02 / На этой неделе', 'Расписание клуба.', 'Занятия проходят утром и вечером. В группе — не больше восьми человек.') + '<div class="schedule-table"><div><span>ПОНЕДЕЛЬНИК</span><b>08:30</b><strong>Мягкая йога</strong><em>Анна · 3 места</em><a href="#contact">Записаться ↗</a></div><div><span>ВТОРНИК</span><b>19:00</b><strong>Пилатес / основа</strong><em>Марк · 2 места</em><a href="#contact">Записаться ↗</a></div><div><span>СРЕДА</span><b>08:30</b><strong>Дыхание и баланс</strong><em>Анна · 5 мест</em><a href="#contact">Записаться ↗</a></div><div><span>ЧЕТВЕРГ</span><b>19:30</b><strong>Восстановление</strong><em>Марк · 4 места</em><a href="#contact">Записаться ↗</a></div></div></section>' +
      '<section class="coaches-section" id="club"><div>' + pageTitle('03 / Люди рядом', 'Наставники, которые слышат.', 'Внимательно относятся к вашему опыту и помогают выбрать свой темп.') + '</div><div class="coach-grid">' + site.coaches.map(function (c) { return '<article><img loading="lazy" src="' + img(c[0], 800) + '" alt="' + c[1] + '"><h3>' + c[1] + '</h3><p>' + c[2] + '</p></article>'; }).join('') + '</div></section>' +
      '<section class="membership" id="contact"><div><p class="site-kicker">Абонемент клуба</p><h2>Пусть хорошее<br>станет привычкой.</h2><p>4 занятия в месяц · любое направление · перенос записи без потери визита.</p></div><div class="membership-price"><b>4 900 ₽</b><span>в месяц</span><a class="site-button" href="mailto:hello@cybercraft.studio">Попробовать клуб <span>↗</span></a></div></section>';
  }

  function orion() {
    return '<section class="site-section" id="system">' + pageTitle('01 / Основа продукта', 'Ясные правила. Быстрые решения.', 'Токены, паттерны и компоненты, собранные так, чтобы продуктовая команда могла сосредоточиться на смысле.') + '<div class="token-board"><article><span>ТИПОГРАФИКА</span><strong>Ag</strong><h3>Говорить ясно</h3><p>Заголовок / 32 px · Текст / 16 px · Подпись / 12 px</p></article><article><span>ЦВЕТОВАЯ СИСТЕМА</span><div class="swatches"><i></i><i></i><i></i><i></i></div><h3>Думать в контексте</h3><p>Роли цветов вместо случайных значений.</p></article><article><span>СЕТКА И РИТМ</span><div class="grid-demo"><i></i><i></i><i></i><i></i><i></i><i></i></div><h3>Держать порядок</h3><p>Предсказуемые отступы на любом экране.</p></article></div></section>' +
      '<section class="orion-components" id="components"><div>' + pageTitle('02 / Живые детали', 'Компоненты, готовые к работе.', 'Каждый элемент продуман для реальных состояний интерфейса — не только для красивого макета.') + '</div><div class="component-preview"><div class="component-side"><span>ПРИВЕТ, АННА</span><b>Обзор продукта</b><a>Активность</a><a>Настройки</a></div><div class="component-main"><div class="component-toolbar"><span>Среда, 21 октября</span><button>Новый проект +</button></div><h3>Доброе утро, Анна</h3><p>У команды всё идёт по плану.</p><div class="component-cards"><article><small>ЗАДАЧИ</small><b>24 / 32</b><i><em style="width:74%"></em></i></article><article><small>В ПРОЦЕССЕ</small><b>08</b><span>На этой неделе</span></article><article><small>КОМАНДА</small><b>06</b><span>Все на связи</span></article></div><div class="component-list"><span>Последние проекты</span><b>Редизайн платформы <i>На проверке</i></b><b>Мобильное приложение <i>В работе</i></b><b>Дизайн-система Orion <i>Завершено</i></b></div></div></div></section>' +
      '<section class="site-section orion-principles" id="principles">' + pageTitle('03 / Встроенные принципы', 'Система работает, когда помогает людям.', 'Доступность, документация и поддержка тем оформлены как часть продукта — а не отдельная задача на потом.') + '<div class="feature-grid"><article class="feature-card"><span>01 / ДОСТУПНОСТЬ</span><h3>Для каждого</h3><p>Контраст, клавиатурная навигация и читаемые состояния заложены в базовые компоненты.</p></article><article class="feature-card"><span>02 / ДОКУМЕНТАЦИЯ</span><h3>Понятно команде</h3><p>Назначение, поведение и примеры доступны рядом с компонентом.</p></article><article class="feature-card"><span>03 / МАСШТАБ</span><h3>Готова к росту</h3><p>Структура выдерживает новые сценарии и остаётся удобной для поддержки.</p></article></div></section>' +
      '<section class="closing-panel" id="contact"><p class="site-kicker">Одна система. Общий язык.</p><h2>Соберём ваш<br>digital-продукт.</h2><a class="site-button" href="mailto:hello@cybercraft.studio">Поговорить о системе <span>↗</span></a></section>';
  }

  var renderers = { atelier: fashion, travel: travel, finance: finance, restaurant: restaurant, architecture: architecture, wellness: wellness, orion: orion };
  root.innerHTML = '<div class="demo-site" data-theme="' + site.theme + '">' + header() + hero() + '<div id="content-start"></div>' + (renderers[requested] || fashion)() + footer() + '<a class="studio-corner" href="' + (isProject ? 'portfolio.html' : 'index.html#website-examples') + '">↖ <span>CyberCraft</span></a><div class="site-toast" role="status" aria-live="polite"></div></div>';
  document.title = (title ? title[0] : site.brand.replace(/<[^>]+>/g, '').trim()) + ' — Концепт CyberCraft';

  root.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () { image.classList.add('image-failed'); }, { once: true });
  });
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  root.querySelectorAll('.site-section,.atelier-story,.restaurant-story,.route-section,.travel-note,.finance-overview,.security-band,.architecture-manifesto,.arch-steps,.wellness-quote,.schedule-section,.coaches-section,.membership,.closing-panel').forEach(function (el) { reveal.observe(el); });

  root.addEventListener('click', function (event) {
    var filter = event.target.closest('.filter-chip');
    if (filter) {
      root.querySelectorAll('.filter-chip').forEach(function (item) { item.classList.toggle('is-active', item === filter); });
      root.querySelectorAll('.product-card').forEach(function (card) { card.hidden = filter.dataset.filter !== 'all' && card.dataset.kind !== filter.dataset.filter; });
      return;
    }
    if (event.target.closest('.quick-add')) {
      var toast = root.querySelector('.site-toast');
      toast.textContent = 'Добавили в вашу подборку'; toast.classList.add('is-visible');
      window.setTimeout(function () { toast.classList.remove('is-visible'); }, 2000);
    }
    if (event.target.matches('.dash-period button')) {
      root.querySelectorAll('.dash-period button').forEach(function (button) { button.classList.toggle('is-active', button === event.target); });
      var delta = { '1м': '1,06%', '3м': '3,84%', '1г': '8,42%', 'Всё': '24,18%' };
      var growth = root.querySelector('.dash-value em');
      if (growth) growth.textContent = '↗ ' + (delta[event.target.textContent] || '8,42%') + ' за период';
    }
  });
  root.querySelectorAll('.demo-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.querySelector('.form-status').textContent = 'Готово — администратор скоро подтвердит удобное время.';
      form.reset();
    });
  });
})();
