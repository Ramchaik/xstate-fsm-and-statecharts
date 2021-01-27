import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");
const elBody = document.body;

const intializeX = (_, event) => event.clientX;
const intializeY = (_, event) => event.clientY;
const updateDeltaX = (context, event) => event.clientX - context.px;
const updateDeltaY = (context, event) => event.clientY - context.py;
const finalizeX = (context, _) => context.x + context.dx;
const finalizeY = (context, _) => context.y + context.dy;

const initalize = () => ({
  px: intializeX,
  py: intializeY,
});

const updateDelta = () => ({
  dx: updateDeltaX,
  dy: updateDeltaY,
});

const finalize = () => ({
  x: finalizeX,
  y: finalizeY,
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const init = () => assign(initalize());
const update = () => assign(updateDelta());
const fin = () => assign(finalize());

const cleanup = () =>
  assign({
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  });

const machine = createMachine({
  initial: "idle",
  // Set the initial context
  // Clue: {
  //   x: 0,
  //   y: 0,
  //   dx: 0,
  //   dy: 0,
  //   px: 0,
  //   py: 0,
  // }
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          // Assign the point
          // ...
          target: "dragging",
          actions: init(),
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          // Assign the delta
          // ...
          // (no target!)
          actions: update(),
        },
        mouseup: {
          // Assign the position
          target: "idle",
          actions: fin(),
        },
        keyup: {
          target: "idle",
          actions: cleanup(),
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty("--dx", state.context.dx);
    elBox.style.setProperty("--dy", state.context.dy);
    elBox.style.setProperty("--x", state.context.x);
    elBox.style.setProperty("--y", state.context.y);
  }
});

service.start();

// Add event listeners for:
// - mousedown on elBox
// - mousemove on elBody
// - mouseup on elBody

elBox.addEventListener("mousedown", service.send);
elBox.addEventListener("mousemove", service.send);
elBox.addEventListener("mouseup", service.send);
document.body.addEventListener("keyup", (e) => {
  if (e.key == "Escape") {
    service.send(e);
  }
});
