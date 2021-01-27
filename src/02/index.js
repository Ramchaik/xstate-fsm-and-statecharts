import { createMachine } from "xstate";

const elBox = document.querySelector("#box");

const machine = createMachine({
  initial: "inactive",
  states: {
    inactive: {
      on: {
        CLICK: "active",
      },
    },
    active: {
      on: {
        CLICK: "inactive",
      },
    },
  },
});

// Change this to the initial state
let currentState = machine.initialState;

function send(event) {
  // Determine and update the `currentState`
  currentState = machine.transition(currentState.value, event);
  elBox.dataset.state = currentState.value;
}

elBox.addEventListener("click", () => {
  // Send a click event
  send("CLICK");
});
