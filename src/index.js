import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// const reloadIndex = () => {
//   navigator.serviceWorker.controller.postMessage({
//     type: "SKIP_WAITING",
//   });
//   setTimeout(() => {
//     window.location.reload();
//   }, 1500);
// };

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

const configuration = {
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      if (window.confirm("Update the app?")) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        setTimeout(() => {
          alert("Update Successful");
          window.location.reload();
        }, 1500);
      }
    }
  },
};
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register(configuration);
