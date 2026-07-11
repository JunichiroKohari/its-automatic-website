import React from 'react';
import { createRoot } from 'react-dom/client';

window.React = React;
window.ReactDOM = { createRoot };

const loadLanding = async () => {
  await import('../../features/landings/ryokan-lp/components.jsx');
  await import('../../features/landings/ryokan-lp/booking.jsx');
  await import('../../features/landings/ryokan-lp/app.jsx');
};

loadLanding();
