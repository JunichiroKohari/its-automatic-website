var e=window.jQuery,{AOS:t}=window,{createREGL:n}=window;function r(){let e=document.querySelector(`#webgl`),t=0,r=n({canvas:e,onDone(e){e&&(document.body.classList.add(`webgl-unavailable`),document.body.classList.remove(`loading`))}}),i=new Image;i.src=`img/gradient_map3.png`,i.onload=()=>{setTimeout(()=>{document.body.classList.remove(`loading`)},1e3);let n=r({frag:`
    #define TWO_PI 6.2831853072
    #define PI 3.14159265359

    precision highp float;

    uniform float globaltime;
    uniform vec2 resolution;
    uniform float aspect;
    uniform float scroll;
    uniform float velocity;
    uniform sampler2D gradient;

    // アニメーションの速さ
    const float timescale = 0.04;

    float nsin(float value) {
      return sin(value * TWO_PI) * 0.9 + 0.2;
    }

    vec2 rotate(vec2 v, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return v * mat2(c, -s, s, c);
    }

    vec3 coordToHex(vec2 coord, float scale, float angle) {
      vec2 c = rotate(coord, angle);
      float q = (1.0 / 3.0 * sqrt(3.0) * c.x - 1.0 / 3.0 * c.y) * scale;
      float r = 2.0 / 3.0 * c.y * scale;
      return vec3(q, r, -q - r);
    }

    vec3 hexToCell(vec3 hex, float m) {
      return fract(hex / m) * 2.0 - 1.0;
    }

    float absMax(vec3 v) {
      return max(max(abs(v.x), abs(v.y)), abs(v.z));
    }

    float hexToFloat(vec3 hex, float amt) {
      return mix(absMax(hex), 1.0 - length(hex) / sqrt(9.0), amt);
    }

    int getHexDir(vec3 hex) {
      if (mod(floor(hex.x) - floor(hex.y) - floor(hex.z), 2.0) == 0.0) {
        return 0;
      } else {
        return 1;
      }
    }

    int getHexType(vec3 hex) {
      if (mod(floor(hex.x) - floor(hex.y) - floor(hex.z), 3.0) == 0.0) {
        return 0;
      } else if (mod(floor(hex.x) - floor(hex.y) - floor(hex.z) - 1.0, 3.0) == 0.0) {
        return 1;
      } else {
        return 2;
      }
    }

    vec3 divideHex(vec3 hex, inout int age, float time) {
      vec3 cell;
      int dir = 0, type = 0;
      float scale = 0.0;

      for (int i = 0; i < 4; i++) {
        scale = 1.0 + float(type) * nsin(time);
        cell = hexToCell(hex * scale, 1.0);
        dir = getHexDir(hex);
        type = getHexType(hex);
        hex = cell;
        if (dir == 1 && type == 1) {
          age = i;
          break;
        }
      }
      return cell;
    }

    void main(void) {
      float time = globaltime * timescale;
      vec2 center = vec2(sin(TWO_PI * time * 0.5), cos(TWO_PI * time * 0.5)) * nsin(time * 0.3) * 0.3;
      vec2 tx = (gl_FragCoord.xy / resolution.xy - 0.5 + center) * vec2(aspect, 1.0) * 2.0;
      float len = 1.0 - length(tx - center * 2.0) * 0.3;
      float zoom = 1.0 + scroll * 1.0;
      float angle = PI * scroll;
      float value = 0.0;
      int age = 0;
      vec3 hex = coordToHex(tx, zoom, angle);
      vec3 cell = divideHex(hex, age, time * 0.1);
      float shift = float(age) / 3.0;

      value = nsin(
        hexToFloat(cell, nsin(time + shift)) * 0.1 * nsin(time * 0.5 + shift)
        + shift
        + time
      ) * len;

      gl_FragColor = texture2D(gradient, vec2(0.0, value));
    }
  `,vert:`attribute vec2 position; void main() { gl_Position = vec4(3.0 * position, 0.0, 1.0); }`,attributes:{position:[-1,0,1,-1,0,1]},count:3,uniforms:{globaltime:r.prop(`globaltime`),resolution:r.prop(`resolution`),aspect:r.prop(`aspect`),scroll:r.prop(`scroll`),velocity:r.prop(`velocity`),gradient:r.texture(i)}});r.frame(i=>{let a=e.scrollWidth/e.scrollHeight;e.width=768*a,e.height=768,t=window.pageYOffset/(document.documentElement.scrollHeight-window.innerHeight),r.clear({color:[0,0,0,0]}),n({globaltime:i.time,resolution:[i.viewportWidth,i.viewportHeight],aspect:a,scroll:t,velocity:0})})}}(function(){let n=0,i=null,a=()=>{n!==0&&(window.scrollBy(0,n),n=0),i=null};window.addEventListener(`wheel`,e=>{if(e.ctrlKey)return;e.preventDefault();let t=window.innerHeight,r=e.deltaMode===WheelEvent.DOM_DELTA_LINE?16:e.deltaMode===WheelEvent.DOM_DELTA_PAGE?t:1;n+=e.deltaY*r,i===null&&(i=window.requestAnimationFrame(a))},{passive:!1,capture:!0});let o=e(window).height();e(`.content`).css({height:o,"padding-top":o*.05,"padding-bottom":o*.05}),e(`.main-visual`).css({height:e(window).height()}),e(window).on(`load resize`,()=>{e(window).width()<=725||e(`.main-subtitle`).html(`/* Software-Oriented Company &#128421; &#128187; &#128241; */`)}),t.init({duration:1e3,once:!0}),e(`.hamb-button`).on(`click`,()=>{e(`.hamb-button`).toggleClass(`close-button`),e(`.nav`).toggleClass(`hamb-nav display-none`)}),e(`.nav-link`).on(`click`,()=>{e(`.hamb-button`).toggleClass(`close-button`),e(`.nav`).toggleClass(`hamb-nav display-none`)}),e(`.contact-txt`).each(function(){let e=this,t=()=>{e.style.height=`auto`,e.style.height=`${e.scrollHeight}px`};t(),e.addEventListener(`input`,t)});let s=new URLSearchParams(window.location.search).get(`contactMessage`),c=document.querySelector(`#message`);s&&c&&(c.value=s,c.dispatchEvent(new Event(`input`,{bubbles:!0})),window.location.hash===`#contact`&&window.requestAnimationFrame(()=>{document.querySelector(`#contact`)?.scrollIntoView({block:`start`})}));let l=e(`.pagetop`),u=!1;e(window).on(`scroll`,()=>{let t=e(window).scrollTop()>200;t!==u&&(u=t,l.stop(!0,!0)[t?`fadeIn`:`fadeOut`](`slow`))}),r()})();