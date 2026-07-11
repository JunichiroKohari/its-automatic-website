import React from 'react';
import { createRoot } from 'react-dom/client';

window.React = React;
window.ReactDOM = { createRoot };

const loadLanding = async () => {
  await import('../../features/landings/ai-training-lp/tweaks-panel.jsx');
  await import('../../features/landings/ai-training-lp/motion.jsx');
  await import('../../features/landings/ai-training-lp/sections-top.jsx');
  await import('../../features/landings/ai-training-lp/sections-mid.jsx');
  await import('../../features/landings/ai-training-lp/sections-bottom.jsx');
  await import('../../features/landings/ai-training-lp/app.jsx');
};

loadLanding();
