import React from 'react';
import { createRoot } from 'react-dom/client';

window.React = React;
window.ReactDOM = { createRoot };

require('../html/businesses/ryokan-lp/components.jsx');
require('../html/businesses/ryokan-lp/booking.jsx');
require('../html/businesses/ryokan-lp/app.jsx');
