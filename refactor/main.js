// Config gsap
const { gsap } = window;

// Initial Loading
window.addEventListener('load', () => {
  if (window.matchMedia('(max-width: 728px)').matches) {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  }

  gsap.set('.cursor', { opacity: 0 });
  document.querySelector('.initial-loader').style.display = 'flex';

  setTimeout(() => {
    gsap.to('.initial-loader', { 
      autoAlpha: 0, 
      duration: 1, 
      ease: "power1.inOut",
      onComplete: () => {
        document.querySelector('.initial-loader').style.display = 'none';
        gsap.set('.cursor', { opacity: 1, duration: 1 });
        gsap.fromTo('body', { autoAlpha: 1 }, { 
          duration: 1, 
          ease: "power1.inOut",
        });
        if (window.matchMedia('(max-width: 728px)').matches) {
          document.body.style.overflow = 'auto';
          document.body.style.height = 'auto';
        }
      }
    });
  }, 6000); 
});

gsap.fromTo("#circle", {
  autoAlpha: 0,        
  opacity: 0            
}, {
  autoAlpha: 1,         
  opacity: 1,          
  duration: 6,       
  ease: "power1.inOut"  
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
  gsap.to(cursorInner, { scale: 1.5, duration: 0.15 });
});

document.body.addEventListener("pointerup", () => {
  gsap.to(cursorInner, { scale: 1, duration: 0.15 });
});

const updateCursor = () => {
  gsap.set(cursorInner, { x: mouse.x, y: mouse.y });
  gsap.to(cursorOuter, {
    x: mouse.x - cursorOuterOriginalState.width / 2,
    y: mouse.y - cursorOuterOriginalState.height / 2,
    duration: 0.15,
  });
  requestAnimationFrame(updateCursor);
};

updateCursor();

const audio = new Audio('assets/audio/sound.mp3');
audio.volume = 0.2;
audio.loop = true; 

$('.button-song button').addClass('inactive');
$('#onSong').css('display', 'none');

$('.button-song button').on('click', function() {
  const offSong = $('#offSong');
  const onSong = $('#onSong');

  offSong.toggle();
  onSong.toggle();

  if (offSong.is(':visible')) {
    $(this).removeClass('active').addClass('inactive');
    audio.pause(); 
  } else {
    $(this).removeClass('inactive').addClass('active');
    audio.play(); 
  }
});

// Header nav
$('.nav-btn').on('click', function(event) {
  event.preventDefault();
  let targetId = $(this).data('target');
  
  $('.content-nav li a').removeClass('active-nav');
  $('section').removeClass('active-section');
  
  $(this).addClass('active-nav');  
  $('#' + targetId).addClass('active-section');

  if (targetId === 'home') {
    $('#home').css('display', 'flex');
    $('#about-me').css('display', 'none');
    $('#career').css('display', 'none');
  }

  if (targetId === 'about-me') {
    $('#about-me').css('display', 'flex');
    $('#home').css('display', 'none');
    $('#career').css('display', 'none');
  }

  if (targetId === 'career') {
    $('#career').css('display', 'flex');
    $('#home').css('display', 'none');
    $('#about-me').css('display', 'none');
  }

  if (targetId === 'about-me' || targetId === 'career') {
    $('footer').fadeOut();
  } else {
    $('footer').fadeIn();
  }
});

// Footer nav
$('.footer-nav-btn').not('.downloader').on('click', function(event) {
  let $this = $(this); 

  if ($this.hasClass('external-link')) {
    $this.addClass('active-footer-nav');
    setTimeout(function() {
      $this.removeClass('active-footer-nav');
    }, 2000);

    return;
  }
  
  event.preventDefault();
  $this.addClass('active-footer-nav');
});

function fadeIn(element) {
  gsap.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: "power1.inOut" });
}

// Função para fadeOut com GSAP
function fadeOut(element) {
  gsap.fromTo(element, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12, ease: "power1.inOut" });
}

// Footer nav downloader
$('.footer-nav-btn.downloader').on('click', function(event) {
  event.preventDefault();
  let $this = $(this);
  let $wrapperOptions = $this.find('.wrapper-options');

  if ($this.hasClass('active-downloader')) {
    $this.removeClass('active-footer-nav active-downloader');
    fadeOut($wrapperOptions);
    setTimeout(() => $wrapperOptions.css('display', 'none').attr('aria-hidden', 'true'), 120);
  } else {
    $('.footer-nav-btn.downloader').removeClass('active-footer-nav active-downloader');
    $('.wrapper-options').css('display', 'none').attr('aria-hidden', 'true');

    $this.addClass('active-footer-nav active-downloader');
    $wrapperOptions.css('display', 'flex').attr('aria-hidden', 'false');
    fadeIn($wrapperOptions);
  }
});

// Download
$('.wrapper-options button').on('click', function() {
  let fileUrl = $(this).data('url');

  if (fileUrl) {
    window.open(fileUrl, '_blank');
  } else {
    console.error('Arquivo não encontrado!');
  }
});

// Language update function
function updateContent(langData) {
  $('[data-i18n]').each(function() {
    const key = $(this).data('i18n');
    const parts = key.split('.');
    let value = langData;

    for (const part of parts) {
      value = value ? value[part] : '';
    }

    $(this).text(value);
  });
}

// Function to set language preference and fetch data
function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  $.getJSON(`assets/languages/${lang}.json`).done(updateContent);

  // Update flag icon
  let flagImg = '';
  if (lang === 'pt-br') {
    flagImg = 'assets/img/brazil-flag.png';
  } else if (lang === 'en-us') {
    flagImg = 'assets/img/usa-flag.png';
  }

  $('#selector a').html(`<img src="${flagImg}" alt="Flag">`);

  $('.wrapper-lang').fadeOut(); 
  $('#selector').removeClass('active'); 
}

// Handle language button clicks
$('#language-selector button').on('click', function() {
  const lang = $(this).attr('id').replace('lang_', '');
  changeLanguage(lang);
});

// Toggle the language selector dropdown
$('#selector').on('click', function() {
  const wrapperLang = $('.wrapper-lang');
  const isVisible = wrapperLang.is(':visible');

  if (isVisible) {
    fadeOut(wrapperLang);
    setTimeout(() => wrapperLang.hide(), 120); 
  } else {
    wrapperLang.show();
    fadeIn(wrapperLang);
  }

  $(this).toggleClass('active');
});

// Use event delegation for dynamically added elements
$(document).on('click', '.content-lang button', function () {
  $('.wrapper-lang').toggle();
  $('#selector').removeClass('active'); 
});

// Set the initial language and update content
const initialLanguage = $('html').attr('lang') || 'en-us';
$(`#language-selector button#lang_${initialLanguage}`).addClass('active');
$.getJSON(`assets/languages/${initialLanguage}.json`).done(updateContent);


const swiper = new Swiper('.swiper-container', {
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
      let activeIndex = this.activeIndex;
      let totalSlides = this.slides.length;

      gsap.set(slides, { clearProps: "all" });

      gsap.to(prevSlide, {
        opacity: 0,
        scale: 0.9, 
        duration: 3, 
        ease: "power2.in"
      });

      gsap.fromTo(currentSlide,
        { opacity: 0, scale: 1.1 }, 
        { opacity: 1, scale: 1, duration: 3, ease: "power2.out" } 
      );

      if (activeIndex === totalSlides - 1) {
        $('.info-text').fadeOut();
      } else {
        $('.info-text').fadeIn();
      }
    }
  }
});

$(".hover").mouseleave(
  function () {
    $(this).removeClass("hover");
  }
);

$('.tl-nav').click(function() {
  $('.tl-nav').removeClass('active-nav-career');
  $(this).addClass('active-nav-career');
  var index = $(this).index();
  $('.tl-content-career').removeClass('active-content-career');
  $('.tl-content-career').eq(index).addClass('active-content-career');
});