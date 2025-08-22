import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'

console.log('main.tsx is running...');
console.log('App component:', App);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
