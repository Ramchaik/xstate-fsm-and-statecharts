import { createMachine } from "xstate";

const elOutput = document.querySelector("#output");

function output(object) {
  elOutput.innerHTML = JSON.stringify(object, null, 2);
}

console.log("Welcome to the XState workshop!");

const user = {
  name: "Vaibhav Singh",
  company: "Google",
  interests: ["piano", "state machines", "reading"],
};

output(user);

const machine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        FETCH: "pending",
      },
    },
    pending: {
      on: {
        RESOLVE: "resolved",
        REJECT: "rejected",
      },
    },
    resolved: {},
    rejected: {},
  },
};

const transition = (state, event) =>
  machine.states[state]?.on?.[event] || state;
