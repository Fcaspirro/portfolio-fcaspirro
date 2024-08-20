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
