import { createMachine, interpret } from "xstate";

const elApp = document.querySelector("#app");
const elOffButton = document.querySelector("#offButton");
const elOnButton = document.querySelector("#onButton");
const elModeButton = document.querySelector("#modeButton");

const displayMachine = createMachine({
  initial: "hidden",
  states: {
    hidden: {
      on: {
        TURN_ON: "visible.hist",
      },
    },
    visible: {
      type: "parallel",
      states: {
        hist: {
          type: "history",
          history: "deep",
        },
        mode: {
          initial: "light",
          states: {
            dark: {
              on: {
                SWITCH: "light",
              },
            },
            light: {
              on: {
                SWITCH: "dark",
              },
            },
          },
        },
        brightness: {
          initial: "bright",
          states: {
            bright: {
              after: {
                2000: "dim",
              },
            },
            dim: {
              on: {
                SWITCH: "bright",
              },
            },
          },
        },
      },
      on: {
        TURN_OFF: "hidden",
      },
      // Add parallel states here for:
      // - mode (light or dark)
      // - brightness (bright or dim)
      // See the README for how the child states of each of those
      // parallel states should transition between each other.
    },
  },
});

const displayService = interpret(displayMachine)
  .onTransition((state) => {
    console.log(state);
    elApp.dataset.state = state.toStrings().join(" ");
  })
  .start();

elOnButton.addEventListener("click", () => {
  displayService.send("TURN_ON");
});

elOffButton.addEventListener("click", () => {
  displayService.send("TURN_OFF");
});

elModeButton.addEventListener("click", () => {
  displayService.send("SWITCH");
});
