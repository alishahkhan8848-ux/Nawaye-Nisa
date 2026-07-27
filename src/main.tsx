import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
window.onerror = function (message, source, lineno, colno, error) {
  console.error("GLOBAL ERROR:", {
    message,
    source,
    lineno,
    colno,
    error,
  });
};

window.onunhandledrejection = function (event) {
  console.error("UNHANDLED PROMISE:", event.reason);
};
window.addEventListener("error", (e) => {
  console.error("GLOBAL ERROR:", e.error || e.message);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("PROMISE ERROR:", e.reason);
});