// Initial Loading
window.addEventListener('load', () => {
  document.querySelector('.cursor').style.opacity = 0;
  document.querySelector('.initial-loader').style.display = 'flex';

  setTimeout(() => {
    document.querySelector('.initial-loader').style.transition = 'opacity 1s ease-in-out';
    document.querySelector('.initial-loader').style.opacity = 0;

    setTimeout(() => {
      document.querySelector('.initial-loader').style.display = 'none';
      document.querySelector('.cursor').style.transition = 'opacity 1s';
      document.querySelector('.cursor').style.opacity = 1;
    }, 1000);
  }, 6000);
});

// Config cursor
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
const lineEq = (y2, y1, x2, x1, currentVal) => {
  let m = (y2 - y1) / (x2 - x1); 
  let b = y1 - m * x1;
  return m * currentVal + b;
};
const lerp = (a, b, n) => (1 - n) * a + n * b;
const body = document.body;
const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;
  if (!e) e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  }
  else if (e.clientX || e.clientY)  {
    posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
  }
  return { x: posx, y: posy };
};

let winsize;
const calcWinsize = () => winsize = { width: window.innerWidth, height: window.innerHeight };
calcWinsize();
window.addEventListener('resize', calcWinsize);

class CursorFx {
  constructor(el) {
    this.DOM = { el: el };
    this.DOM.dot = this.DOM.el.querySelector('.cursor-small');
    this.DOM.circle = this.DOM.el.querySelector('.cursor-large');
    this.bounds = { dot: this.DOM.dot.getBoundingClientRect(), circle: this.DOM.circle.getBoundingClientRect() };
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { dot: { x: 0, y: 0 }, circle: { x: 0, y: 0 } };
    
    this.initEvents();
    requestAnimationFrame(() => this.render());
  }

  initEvents() {
    window.addEventListener('mousemove', ev => this.mousePos = getMousePos(ev));
  }

  render() {
    this.lastMousePos.dot.x = lerp(this.lastMousePos.dot.x, this.mousePos.x - this.bounds.dot.width / 2, 0.25);
    this.lastMousePos.dot.y = lerp(this.lastMousePos.dot.y, this.mousePos.y - this.bounds.dot.height / 2, 0.25);
    this.lastMousePos.circle.x = lerp(this.lastMousePos.circle.x, this.mousePos.x - this.bounds.circle.width / 2, 1);
    this.lastMousePos.circle.y = lerp(this.lastMousePos.circle.y, this.mousePos.y - this.bounds.circle.height / 2, 1);
    this.DOM.dot.style.transform = `translateX(${(this.lastMousePos.dot.x)}px) translateY(${this.lastMousePos.dot.y}px)`;
    this.DOM.circle.style.transform = `translateX(${(this.lastMousePos.circle.x)}px) translateY(${this.lastMousePos.circle.y}px)`;
    requestAnimationFrame(() => this.render());
  }
}

const cursor = new CursorFx(document.querySelector('.cursor'));

// Audio control
const audio = new Audio('assets/audio/sound.mp3');
audio.volume = 0.35;
audio.loop = true;

const buttonSong = document.querySelector('.button-song button');
const onSong = document.getElementById('onSong');
const offSong = document.getElementById('offSong');
buttonSong.classList.add('inactive');
onSong.style.display = 'none';

buttonSong.addEventListener('click', () => {
  if (onSong.style.display === 'none') {
    onSong.style.display = 'block';
    offSong.style.display = 'none';
    buttonSong.classList.add('active');
    buttonSong.classList.remove('inactive');
    audio.play();
  } else {
    onSong.style.display = 'none';
    offSong.style.display = 'block';
    buttonSong.classList.add('inactive');
    buttonSong.classList.remove('active');
    audio.pause();
  }
});

// Header nav
const navBtns = document.querySelectorAll('.nav-btn');
navBtns.forEach(btn => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = btn.dataset.target;

    document.querySelectorAll('.content-nav li a').forEach(el => el.classList.remove('active-nav'));
    document.querySelectorAll('section').forEach(el => {
      el.classList.remove('active-section');
      el.style.display = 'none';
    });

    btn.classList.add('active-nav');
    const targetSection = document.getElementById(targetId);
    targetSection.style.display = 'flex';
    targetSection.classList.add('active-section');
  });
});

// Footer nav
const footerNavBtns = document.querySelectorAll('.footer-nav-btn');
footerNavBtns.forEach(btn => {
  if (!btn.classList.contains('downloader')) {
    btn.addEventListener('click', (event) => {
      if (btn.classList.contains('external-link')) {
        btn.classList.add('active-footer-nav');
        setTimeout(() => btn.classList.remove('active-footer-nav'), 2000);
      } else {
        event.preventDefault();
        btn.classList.add('active-footer-nav');
      }
    });
  }
});

function fadeIn(element) {
  element.style.transition = 'opacity 0.12s ease-in-out';
  element.style.opacity = 1;
}

function fadeOut(element) {
  element.style.transition = 'opacity 0.12s ease-in-out';
  element.style.opacity = 0;
}

// Downloader button logic
const downloaderBtns = document.querySelectorAll('.footer-nav-btn.downloader');
downloaderBtns.forEach(btn => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    const wrapperOptions = btn.querySelector('.wrapper-options');
    if (btn.classList.contains('active-downloader')) {
      btn.classList.remove('active-footer-nav', 'active-downloader');
      fadeOut(wrapperOptions);
      setTimeout(() => wrapperOptions.style.display = 'none', 120);
    } else {
      downloaderBtns.forEach(b => {
        b.classList.remove('active-footer-nav', 'active-downloader');
        b.querySelector('.wrapper-options').style.display = 'none';
      });
      btn.classList.add('active-footer-nav', 'active-downloader');
      wrapperOptions.style.display = 'flex';
      fadeIn(wrapperOptions);
    }
  });
});

// Download action
document.querySelectorAll('.wrapper-options button').forEach(btn => {
  btn.addEventListener('click', () => {
    const fileUrl = btn.dataset.url;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      console.error('Arquivo não encontrado!');
    }
  });
});

// Language update
function updateContent(langData) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    const parts = key.split('.');
    let value = langData;
    parts.forEach(part => {
      value = value ? value[part] : '';
    });
    element.textContent = value;
  });
}

// Change language
function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  fetch(`assets/languages/${lang}.json`)
    .then(response => response.json())
    .then(data => updateContent(data));

  const flagImg = lang === 'pt-br' ? 'assets/img/brazil-flag.webp' : 'assets/img/usa-flag.webp';
  document.getElementById('selector').querySelector('a').innerHTML = `<img src="${flagImg}" alt="Flag">`;

  document.getElementById('lang_pt-br').addEventListener('click', () => changeLanguage('pt-br'));
  document.getElementById('lang_en-us').addEventListener('click', () => changeLanguage('en-us'));
}

// Handle language button clicks
document.querySelectorAll('#language-selector button').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.id.replace('lang_', '');
    changeLanguage(lang);
  });
});

// Toggle language selector
document.getElementById('selector').addEventListener('click', () => {
  const wrapperLang = document.querySelector('.wrapper-lang');
  const isVisible = wrapperLang.style.display === 'block';

  if (isVisible) {
    fadeOut(wrapperLang);
    setTimeout(() => wrapperLang.style.display = 'none', 120);
  } else {
    wrapperLang.style.display = 'block';
    fadeIn(wrapperLang);
  }

  document.getElementById('selector').classList.toggle('active');
});

// Initialize language
const initialLanguage = document.documentElement.lang || 'en-us';
document.getElementById(`lang_${initialLanguage}`).classList.add('active');
fetch(`assets/languages/${initialLanguage}.json`)
  .then(response => response.json())
  .then(data => updateContent(data));

// Swiper initialization (assumindo que a biblioteca Swiper está disponível)
const swiperContainer = document.querySelector('.swiper-container');
if (swiperContainer) {
  const swiper = new Swiper(swiperContainer, {
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      prevEl: '.swiper-button-prev',
      nextEl: '.swiper-button-next'
    },
    speed: 600,
    on: {
      slideChangeTransitionStart: function () {
        const slides = document.querySelectorAll('.swiper-slide');
        const currentSlide = slides[swiper.activeIndex];
        const prevSlide = slides[swiper.previousIndex];
        const activeIndex = swiper.activeIndex;
        const totalSlides = swiper.slides.length;

        slides.forEach(slide => slide.style.transition = 'none');

        prevSlide.style.transition = 'opacity 3s ease-in, transform 3s ease-in';
        prevSlide.style.opacity = 0;
        prevSlide.style.transform = 'scale(0.9)';

        currentSlide.style.transition = 'opacity 3s ease-out, transform 3s ease-out';
        currentSlide.style.opacity = 1;
        currentSlide.style.transform = 'scale(1)';

        document.querySelector('.info-text').style.display = activeIndex === totalSlides - 1 ? 'none' : 'flex';
      }
    }
  });
}

// Hover effect
document.querySelectorAll('.hover').forEach(el => {
  el.addEventListener('mouseleave', () => {
    el.classList.remove('hover');
  });
});

// Timeline navigation
const tlNavs = document.querySelectorAll('.tl-nav');
tlNavs.forEach((nav, index) => {
  nav.addEventListener('click', () => {
    tlNavs.forEach(n => n.classList.remove('active-nav-career'));
    nav.classList.add('active-nav-career');
    const contents = document.querySelectorAll('.tl-content-career');
    contents.forEach(content => content.classList.remove('active-content-career'));
    contents[index].classList.add('active-content-career');
  });
});

// View description modal
document.querySelectorAll('.view-desc-mobile a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const currentSlider = link.closest('.swiper-slide');
    const descriptionContent = currentSlider.querySelector('.desc-project .description').innerHTML;
    const usefulLinksContent = currentSlider.querySelector('.desc-project .useful-links').innerHTML;
    const techsContent = currentSlider.querySelector('.wrapper-techs').innerHTML;

    const modal = document.getElementById('project-modal');
    modal.querySelector('.modal-desc-content').innerHTML = `
      <div class="modal-description">${descriptionContent}</div>
      <div class="modal-useful-links useful-links">${usefulLinksContent}</div>
      <div class="modal-techs">${techsContent}</div>
    `;
    modal.style.display = 'block';
  });
});

// Close modal
const closeModalBtn = document.querySelector('.close-modal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    document.getElementById('project-modal').style.display = 'none';
  });
}

// Click outside modal to close
window.addEventListener('click', (e) => {
  if (e.target.id === 'project-modal') {
    document.getElementById('project-modal').style.display = 'none';
  }
});
