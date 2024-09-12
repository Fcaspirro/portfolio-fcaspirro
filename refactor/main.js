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
const cursorOuter = document.querySelector(".cursor--large");
const cursorInner = document.querySelector(".cursor--small");
let mouse = { x: -100, y: -100 };

const cursorOuterOriginalState = {
  width: cursorOuter.offsetWidth,
  height: cursorOuter.offsetHeight,
};

document.body.addEventListener("pointermove", ({ pageX, pageY }) => {
  mouse = { x: pageX, y: pageY };
});

document.body.addEventListener("pointerdown", () => {
  cursorInner.style.transform = 'scale(1.5)';
});

document.body.addEventListener("pointerup", () => {
  cursorInner.style.transform = 'scale(1)';
});

const updateCursor = () => {
  cursorInner.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
  cursorOuter.style.transform = `translate(${mouse.x - cursorOuterOriginalState.width / 2}px, ${mouse.y - cursorOuterOriginalState.height / 2}px)`;
  requestAnimationFrame(updateCursor);
};

updateCursor();

// Audio control
const audio = new Audio('assets/audio/sound.mp3');
audio.volume = 0.2;
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

  const flagImg = lang === 'pt-br' ? 'assets/img/brazil-flag.png' : 'assets/img/usa-flag.png';
  document.getElementById('selector').querySelector('a').innerHTML = `<img src="${flagImg}" alt="Flag">`;

  document.querySelector('.wrapper-lang').style.display = 'none';
  document.getElementById('selector').classList.remove('active');
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

        document.querySelector('.info-text').style.display = activeIndex === totalSlides - 1 ? 'none' : 'block';
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
