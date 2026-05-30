import React from 'react'
import { createRoot } from 'react-dom/client'

import '../html/businesses/ai-training-lp/styles.css'

window.React = React
window.ReactDOM = { createRoot }

require('../html/businesses/ai-training-lp/tweaks-panel.jsx')
require('../html/businesses/ai-training-lp/motion.jsx')
require('../html/businesses/ai-training-lp/sections-top.jsx')
require('../html/businesses/ai-training-lp/sections-mid.jsx')
require('../html/businesses/ai-training-lp/sections-bottom.jsx')
require('../html/businesses/ai-training-lp/app.jsx')
