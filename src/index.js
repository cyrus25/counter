import React from "react";
import { createDocStore } from "@syncstate/core";
import { Provider, useDoc } from "@syncstate/react";
import ReactDOM from "react-dom";
import "./index.css";
import Counter from "./Counter";
import io from "socket.io-client";
import reportWebVitals from "./reportWebVitals";
import * as remote from "@syncstate/remote-client";

const store = createDocStore({ counter: 0 }, [remote.createInitializer()]);

store.dispatch(remote.enableRemote("/counter"));

//setting up socket connection with the server
var socket = io.connect("http://localhost:8000", {
  timeout: 100000,
});

// loading the app for the first time
socket.emit("fetchDoc", "/counter");

//whenever there is some attempt to change the store state
store.observe("doc", "/counter", (counter, change) => {
  if (!change.origin) {
    //send json patch to the server
    socket.emit("change", "/counter", change);
  }
});

//get patches from server and dispatch
socket.on("change", (path, patch) => {
  store.dispatch(remote.applyRemote(path, patch));
});

ReactDOM.render(
  <>
    <Provider store={store}>
      <Counter />
    </Provider>
  </>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
