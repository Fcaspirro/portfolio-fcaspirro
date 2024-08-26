// Config gsap
const { gsap } = window;

// Initial Loading
window.addEventListener('load', () => {
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
          ease: "power1.inOut" 
        });
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

// Song
$(document).ready(function() {
  $('.button-song button').addClass('inactive');
  $('#onSong').css('display', 'none');

  $('.button-song button').on('click', function() {
      const offSong = $('#offSong');
      const onSong = $('#onSong');

      offSong.toggle();
      onSong.toggle();
      if (offSong.is(':visible')) {
          $(this).removeClass('active').addClass('inactive');
      } else {
          $(this).removeClass('inactive').addClass('active');
      }
  });
});

// Header nav
$('.nav-btn').on('click', function(event) {
  event.preventDefault();
  let targetId = $(this).data('target');
  
  $('.content-nav li a').removeClass('active-nav');
  $('section').removeClass('active-section');
  $(this).addClass('active-nav');  
  $('#' + targetId).addClass('active-section');
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

// Footer nav downloader
$('.footer-nav-btn.downloader').on('click', function(event) {
  event.preventDefault();
  let $this = $(this);
  let $wrapperOptions = $this.find('.wrapper-options');

  if ($this.hasClass('active-downloader')) {
    $this.removeClass('active-footer-nav active-downloader');
    $wrapperOptions.css('display', 'none').attr('aria-hidden', 'true');
  } else {
    $('.footer-nav-btn.downloader').removeClass('active-footer-nav active-downloader');
    $('.wrapper-options').css('display', 'none').attr('aria-hidden', 'true');

    $this.addClass('active-footer-nav active-downloader');
    $wrapperOptions.css('display', 'flex').attr('aria-hidden', 'false');
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

// Language
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

  // Substitui o ícone pela imagem da bandeira correspondente
  let flagImg = '';
  if (lang === 'pt-br') {
    flagImg = 'assets/img/brazil-flag.png';
  } else if (lang === 'en-us') {
    flagImg = 'assets/img/usa-flag.png';
  }

  $('#selector a').html(`<img src="${flagImg}" alt="Flag">`);

  $('.wrapper-lang').hide(); 
  $('#selector').removeClass('active'); 
}

// Handle language button clicks
$('#language-selector button').on('click', function() {
  const lang = $(this).attr('id').replace('lang_', '');
  changeLanguage(lang);
});

// Toggle the language selector dropdown
$('#selector').on('click', function() {
  $('.wrapper-lang').toggle();
  $(this).toggleClass('active');
});

// Use event delegation for dynamically added elements
$(document).on('click', '.content-lang button', function () {
  $('.wrapper-lang').toggle();
  $('#selector').removeClass('active'); 
});

// Set the initial language and update content
const initialLanguage = $('html').attr('lang');
$(`#language-selector button#lang_${initialLanguage}`).addClass('active');
$.getJSON(`assets/languages/${initialLanguage}.json`).done(updateContent);
