import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // This is your Tailwind CSS import
import App from './App';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
