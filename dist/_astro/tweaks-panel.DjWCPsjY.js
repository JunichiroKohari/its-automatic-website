import{t as e}from"./jsx-runtime.DI9EyDG7.js";var t=e(),n=`
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;function r(e){let[t,n]=React.useState(e);return[t,React.useCallback((e,t)=>{let r=typeof e==`object`&&e?e:{[e]:t};n(e=>({...e,...r})),window.parent.postMessage({type:`__edit_mode_set_keys`,edits:r},`*`),window.dispatchEvent(new CustomEvent(`tweakchange`,{detail:r}))},[])]}function i({title:e=`Tweaks`,noDeckControls:r=!1,children:i}){let[o,s]=React.useState(!1),l=React.useRef(null),u=React.useMemo(()=>typeof document<`u`&&!!document.querySelector(`deck-stage`),[]),[d,f]=React.useState(()=>u&&!!document.querySelector(`deck-stage`)?._railEnabled);React.useEffect(()=>{if(!u||d)return;let e=e=>{e.data&&e.data.type===`__omelette_rail_enabled`&&f(!0)};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[u,d]);let[p,m]=React.useState(()=>{try{return localStorage.getItem(`deck-stage.railVisible`)!==`0`}catch{return!0}}),h=e=>{m(e),window.postMessage({type:`__deck_rail_visible`,on:e},`*`)},g=React.useRef({x:16,y:16}),_=React.useCallback(()=>{let e=l.current;if(!e)return;let t=e.offsetWidth,n=e.offsetHeight,r=Math.max(16,window.innerWidth-t-16),i=Math.max(16,window.innerHeight-n-16);g.current={x:Math.min(r,Math.max(16,g.current.x)),y:Math.min(i,Math.max(16,g.current.y))},e.style.right=`${g.current.x}px`,e.style.bottom=`${g.current.y}px`},[]);return React.useEffect(()=>{if(!o)return;if(_(),typeof ResizeObserver>`u`)return window.addEventListener(`resize`,_),()=>window.removeEventListener(`resize`,_);let e=new ResizeObserver(_);return e.observe(document.documentElement),()=>e.disconnect()},[o,_]),React.useEffect(()=>{let e=e=>{let t=e?.data?.type;t===`__activate_edit_mode`?s(!0):t===`__deactivate_edit_mode`&&s(!1)};return window.addEventListener(`message`,e),window.parent.postMessage({type:`__edit_mode_available`},`*`),()=>window.removeEventListener(`message`,e)},[]),o?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(`style`,{children:n}),(0,t.jsxs)(`div`,{ref:l,className:`twk-panel`,"data-noncommentable":``,style:{right:g.current.x,bottom:g.current.y},children:[(0,t.jsxs)(`div`,{className:`twk-hd`,role:`presentation`,onMouseDown:e=>{let t=l.current;if(!t)return;let n=t.getBoundingClientRect(),r=e.clientX,i=e.clientY,a=window.innerWidth-n.right,o=window.innerHeight-n.bottom,s=e=>{g.current={x:a-(e.clientX-r),y:o-(e.clientY-i)},_()},c=()=>{window.removeEventListener(`mousemove`,s),window.removeEventListener(`mouseup`,c)};window.addEventListener(`mousemove`,s),window.addEventListener(`mouseup`,c)},children:[(0,t.jsx)(`b`,{children:e}),(0,t.jsx)(`button`,{type:`button`,className:`twk-x`,"aria-label":`Close tweaks`,onMouseDown:e=>e.stopPropagation(),onClick:()=>{s(!1),window.parent.postMessage({type:`__edit_mode_dismissed`},`*`)},children:`✕`})]}),(0,t.jsxs)(`div`,{className:`twk-body`,children:[i,u&&d&&!r&&(0,t.jsx)(a,{label:`Deck`,children:(0,t.jsx)(c,{label:`Thumbnail rail`,value:p,onChange:h})})]})]})]}):null}function a({label:e,children:n}){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(`div`,{className:`twk-sect`,children:e}),n]})}function o({label:e,value:n,children:r,inline:i=!1}){return(0,t.jsxs)(`div`,{className:i?`twk-row twk-row-h`:`twk-row`,children:[(0,t.jsxs)(`div`,{className:`twk-lbl`,children:[(0,t.jsx)(`span`,{children:e}),n!=null&&(0,t.jsx)(`span`,{className:`twk-val`,children:n})]}),r]})}function s({label:e,value:n,min:r=0,max:i=100,step:a=1,unit:s=``,onChange:c}){return(0,t.jsx)(o,{label:e,value:`${n}${s}`,children:(0,t.jsx)(`input`,{type:`range`,className:`twk-slider`,min:r,max:i,step:a,value:n,onChange:e=>c(Number(e.target.value))})})}function c({label:e,value:n,onChange:r}){return(0,t.jsxs)(`div`,{className:`twk-row twk-row-h`,children:[(0,t.jsx)(`div`,{className:`twk-lbl`,children:(0,t.jsx)(`span`,{children:e})}),(0,t.jsx)(`button`,{type:`button`,className:`twk-toggle`,"data-on":n?`1`:`0`,role:`switch`,"aria-checked":!!n,onClick:()=>r(!n),children:(0,t.jsx)(`i`,{})})]})}function l({label:e,value:n,options:r,onChange:i}){let a=React.useRef(null),[s,c]=React.useState(!1),l=React.useRef(n);l.current=n;let d=e=>String(typeof e==`object`?e.label:e).length;if(!(r.reduce((e,t)=>Math.max(e,d(t)),0)<=({2:16,3:10}[r.length]??0))){let a=e=>{let t=r.find(t=>String(typeof t==`object`?t.value:t)===e);return t===void 0?e:typeof t==`object`?t.value:t};return(0,t.jsx)(u,{label:e,value:n,options:r,onChange:e=>i(a(e))})}let f=r.map(e=>typeof e==`object`?e:{value:e,label:e}),p=Math.max(0,f.findIndex(e=>e.value===n)),m=f.length,h=e=>{let t=a.current.getBoundingClientRect(),n=t.width-4,r=Math.floor((e-t.left-2)/n*m);return f[Math.max(0,Math.min(m-1,r))].value};return(0,t.jsx)(o,{label:e,children:(0,t.jsxs)(`div`,{ref:a,role:`radiogroup`,onPointerDown:e=>{c(!0);let t=h(e.clientX);t!==l.current&&i(t);let n=e=>{if(!a.current)return;let t=h(e.clientX);t!==l.current&&i(t)},r=()=>{c(!1),window.removeEventListener(`pointermove`,n),window.removeEventListener(`pointerup`,r)};window.addEventListener(`pointermove`,n),window.addEventListener(`pointerup`,r)},className:s?`twk-seg dragging`:`twk-seg`,children:[(0,t.jsx)(`div`,{className:`twk-seg-thumb`,style:{left:`calc(2px + ${p} * (100% - 4px) / ${m})`,width:`calc((100% - 4px) / ${m})`}}),f.map(e=>(0,t.jsx)(`button`,{type:`button`,role:`radio`,"aria-checked":e.value===n,children:e.label},e.value))]})})}function u({label:e,value:n,options:r,onChange:i}){return(0,t.jsx)(o,{label:e,children:(0,t.jsx)(`select`,{className:`twk-field`,value:n,onChange:e=>i(e.target.value),children:r.map(e=>{let n=typeof e==`object`?e.value:e;return(0,t.jsx)(`option`,{value:n,children:typeof e==`object`?e.label:e},n)})})})}function d({label:e,value:n,placeholder:r,onChange:i}){return(0,t.jsx)(o,{label:e,children:(0,t.jsx)(`input`,{className:`twk-field`,type:`text`,value:n,placeholder:r,onChange:e=>i(e.target.value)})})}function f({label:e,value:n,min:r,max:i,step:a=1,unit:o=``,onChange:s}){let c=e=>r!=null&&e<r?r:i!=null&&e>i?i:e,l=React.useRef({x:0,val:0});return(0,t.jsxs)(`div`,{className:`twk-num`,children:[(0,t.jsx)(`span`,{className:`twk-num-lbl`,onPointerDown:e=>{e.preventDefault(),l.current={x:e.clientX,val:n};let t=(String(a).split(`.`)[1]||``).length,r=e=>{let n=e.clientX-l.current.x,r=l.current.val+n*a,i=Math.round(r/a)*a;s(c(Number(i.toFixed(t))))},i=()=>{window.removeEventListener(`pointermove`,r),window.removeEventListener(`pointerup`,i)};window.addEventListener(`pointermove`,r),window.addEventListener(`pointerup`,i)},children:e}),(0,t.jsx)(`input`,{type:`number`,value:n,min:r,max:i,step:a,onChange:e=>s(c(Number(e.target.value)))}),o&&(0,t.jsx)(`span`,{className:`twk-num-unit`,children:o})]})}function p(e){let t=String(e).replace(`#`,``),n=t.length===3?t.replace(/./g,e=>e+e):t.padEnd(6,`0`),r=parseInt(n.slice(0,6),16);if(Number.isNaN(r))return!0;let i=r>>16&255,a=r>>8&255,o=r&255;return i*299+a*587+o*114>148e3}var m=({light:e})=>(0,t.jsx)(`svg`,{viewBox:`0 0 14 14`,"aria-hidden":`true`,children:(0,t.jsx)(`path`,{d:`M3 7.2 5.8 10 11 4.2`,fill:`none`,strokeWidth:`2.2`,strokeLinecap:`round`,strokeLinejoin:`round`,stroke:e?`rgba(0,0,0,.78)`:`#fff`})});function h({label:e,value:n,options:r,onChange:i}){if(!r||!r.length)return(0,t.jsxs)(`div`,{className:`twk-row twk-row-h`,children:[(0,t.jsx)(`div`,{className:`twk-lbl`,children:(0,t.jsx)(`span`,{children:e})}),(0,t.jsx)(`input`,{type:`color`,className:`twk-swatch`,value:n,onChange:e=>i(e.target.value)})]});let a=e=>String(JSON.stringify(e)).toLowerCase(),s=a(n);return(0,t.jsx)(o,{label:e,children:(0,t.jsx)(`div`,{className:`twk-chips`,role:`radiogroup`,children:r.map((e,n)=>{let r=Array.isArray(e)?e:[e],[o,...c]=r,l=c.slice(0,4),u=a(e)===s;return(0,t.jsxs)(`button`,{type:`button`,className:`twk-chip`,role:`radio`,"aria-checked":u,"data-on":u?`1`:`0`,"aria-label":r.join(`, `),title:r.join(` · `),style:{background:o},onClick:()=>i(e),children:[l.length>0&&(0,t.jsx)(`span`,{children:l.map((e,n)=>(0,t.jsx)(`i`,{style:{background:e}},n))}),u&&(0,t.jsx)(m,{light:p(o)})]},n)})})})}function g({label:e,onClick:n,secondary:r=!1}){return(0,t.jsx)(`button`,{type:`button`,className:r?`twk-btn secondary`:`twk-btn`,onClick:n,children:e})}Object.assign(window,{useTweaks:r,TweaksPanel:i,TweakSection:a,TweakRow:o,TweakSlider:s,TweakToggle:c,TweakRadio:l,TweakSelect:u,TweakText:d,TweakNumber:f,TweakColor:h,TweakButton:g});