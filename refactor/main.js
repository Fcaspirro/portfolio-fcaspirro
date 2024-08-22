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
$('.footer-nav-btn').on('click', function(event) {
  event.preventDefault();
  let $this = $(this);
  $this.addClass('active-footer-nav');
  setTimeout(function() {
    $this.removeClass('active-footer-nav');
  }, 5000);
});