import gl from './gl';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../components/App'


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// document.addEventListener('DOMContentLoaded', () => {
//   const servicesSection = document.querySelector('.services');
  
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           servicesSection.classList.add('visible');
//         }
//       });
//     },
//     {
//       threshold: 0.1,
//       rootMargin: '-100px'
//     }
//   );

//   if (servicesSection) {
//     observer.observe(servicesSection);
//   }
// });

