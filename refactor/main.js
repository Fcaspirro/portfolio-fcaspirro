// Config cursor
const { gsap } = window;

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

// Hidden cursor on hover
$(document).ready(function() {
  $('.content-nav li a').hover(
    function() {
      gsap.to('.cursor', { opacity: 0, duration: 0.3 });
    }, 
    function() {
      gsap.to('.cursor', { opacity: 1, duration: 0.3 });
    }
  );
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
    gsap.to($wrapperOptions, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: function() {
        $this.removeClass('active-footer-nav active-downloader');
        $wrapperOptions.css('display', 'none').attr('aria-hidden', 'true');
      }
    });
  } else {
    $('.footer-nav-btn.downloader').removeClass('active-footer-nav active-downloader');
    $('.wrapper-options').each(function() {
      gsap.to($(this), {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: function() {
          $(this).css('display', 'none').attr('aria-hidden', 'true');
        }
      });
    });
    $this.addClass('active-footer-nav active-downloader');
    $wrapperOptions.css('display', 'flex').attr('aria-hidden', 'false');
    gsap.fromTo($wrapperOptions, {
      opacity: 0,
      y: -20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.3
    });
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