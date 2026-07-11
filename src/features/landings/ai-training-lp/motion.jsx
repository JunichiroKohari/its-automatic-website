/* ============================================================
   Motion helpers — Reveal, CountUp, Parallax, Typing
   Apple-style scroll-triggered animations · subtle, editorial
   ============================================================ */

/* ─── useInView: simple IntersectionObserver hook ─── */
function useInView(opts = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = opts;
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || (once && seen)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          setSeen(true);
          if (once) io.disconnect();
        } else if (!once) {
          setSeen(false);
        }
      }),
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once, seen]);
  return [ref, seen];
}

/* ─── <Reveal>: fade + slide-up on enter viewport ─── */
function Reveal({
  children, delay = 0, y = 24, as: As = 'div', style, ...rest
}) {
  const [ref, inView] = useInView();
  return (
    <As
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22,0.61,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,0.61,0.36,1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </As>
  );
}

/* ─── <Stagger>: children fade-in sequentially ─── */
function Stagger({
  children, step = 0.08, baseDelay = 0, y = 20, style, ...rest
}) {
  const kids = React.Children.toArray(children);
  return (
    <div style={style} {...rest}>
      {kids.map((c, i) => (
        <Reveal key={c.key ?? i} delay={baseDelay + i * step} y={y}>
          {c}
        </Reveal>
      ))}
    </div>
  );
}

/* ─── useCountUp: animate number when in view ─── */
function useCountUp(target, { duration = 1400, decimals = 0, when = true } = {}) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!when) return;
    let raf;
    const start = performance.now();
    const easeOut = (t) => 1 - ((1 - t) ** 3);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(target * easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, when]);
  return val.toFixed(decimals);
}

/* ─── <Counter>: display a count-up number ─── */
function Counter({
  to, decimals = 0, prefix = '', suffix = '', duration = 1400,
}) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const val = useCountUp(to, { duration, decimals, when: inView });
  return (
    <span ref={ref}>
      {prefix}
      {Number(val).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ─── useParallax: scroll-linked transform ─── */
function useParallax(speed = 0.15) {
  const ref = React.useRef(null);
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2 - vh / 2;
      setY(-center * speed);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);
  return [ref, y];
}

/* ─── <Parallax>: wraps children with scroll-linked translate ─── */
function Parallax({
  children, speed = 0.15, style, ...rest
}) {
  const [ref, y] = useParallax(speed);
  return (
    <div ref={ref} style={{ transform: `translate3d(0, ${y}px, 0)`, willChange: 'transform', ...style }} {...rest}>
      {children}
    </div>
  );
}

/* ─── useTyping: progressively reveals a string ─── */
function useTyping(text, { delay = 0, speed = 30, when = true } = {}) {
  const [out, setOut] = React.useState('');
  React.useEffect(() => {
    if (!when) { setOut(''); return; }
    setOut('');
    let i = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }, delay);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [text, delay, speed, when]);
  return out;
}

/* ─── <Bar>: animated horizontal bar that grows when in view ─── */
function Bar({
  value, max = 100, color = 'var(--brand)', bg = 'var(--border-2)', height = 8, duration = 1100, delay = 0, label, suffix = '',
}) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div ref={ref}>
      {label && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12, color: 'var(--ink-2)', marginBottom: 6,
        }}
        >
          <span>{label}</span>
          <span style={{ fontFamily: 'var(--serif)', color: 'var(--ink-1)', fontWeight: 500 }}>
            <Counter to={value} suffix={suffix} duration={duration} />
          </span>
        </div>
      )}
      <div style={{
        height, background: bg, borderRadius: height, overflow: 'hidden',
      }}
      >
        <div style={{
          height: '100%',
          width: inView ? `${pct}%` : '0%',
          background: color,
          borderRadius: height,
          transition: `width ${duration}ms cubic-bezier(0.22,0.61,0.36,1) ${delay}ms`,
        }}
        />
      </div>
    </div>
  );
}

Object.assign(window, {
  useInView, Reveal, Stagger, useCountUp, Counter, useParallax, Parallax, useTyping, Bar,
});
