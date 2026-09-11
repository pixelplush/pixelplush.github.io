(() => {
  if (window.__pixelPlushBirthdayCelebration) return;
  window.__pixelPlushBirthdayCelebration = true;

  const bannerId = 'pp-birthday-banner';
  const layerId = 'pp-birthday-confetti-layer';
  const dismissKey = 'pp-birthday-7-dismissed';
  const colors = ['#e94f64', '#f4b942', '#2f9c95', '#4f6bd8', '#9c5cc4', '#f07aa9'];

  function removeCelebration() {
    document.getElementById(bannerId)?.remove();
    document.getElementById(layerId)?.remove();
  }

  function addBalloon(layer, color, left, delay) {
    const balloon = document.createElement('i');
    balloon.className = 'pp-birthday-balloon';
    balloon.style.setProperty('--color', color);
    balloon.style.setProperty('--left', left);
    balloon.style.setProperty('--delay', delay);
    layer.appendChild(balloon);
  }

  function addSparkle(layer, index) {
    const sparkle = document.createElement('i');
    sparkle.className = 'pp-birthday-sparkle';
    sparkle.textContent = index % 2 ? '+' : '*';
    sparkle.style.setProperty('--left', `${8 + Math.random() * 84}%`);
    sparkle.style.setProperty('--top', `${12 + Math.random() * 64}%`);
    sparkle.style.setProperty('--delay', `${Math.random() * 1.6}s`);
    layer.appendChild(sparkle);
  }

  function showCelebration() {
    if (sessionStorage.getItem(dismissKey) === '1' || document.getElementById(bannerId)) return;

    const banner = document.createElement('div');
    banner.id = bannerId;
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-label', "PixelPlush's 7th birthday celebration");
    Object.assign(banner.style, {
      alignItems: 'center',
      background: 'linear-gradient(100deg, #fff0b8, #ffd6e7 48%, #c9f2e8)',
      borderBottom: '2px solid #d19a2d',
      color: '#4f2727',
      display: 'flex',
      fontFamily: 'inherit',
      fontSize: '14px',
      fontWeight: '700',
      gap: '10px',
      justifyContent: 'center',
      minHeight: '48px',
      overflow: 'hidden',
      padding: '9px 52px',
      position: 'relative',
      textAlign: 'center',
      width: '100%',
      zIndex: '25',
    });

    const badge = document.createElement('strong');
    badge.textContent = 'PIXELPLUSH IS 7';
    badge.style.letterSpacing = '0.08em';
    banner.appendChild(badge);

    const message = document.createElement('span');
    message.textContent = "We're celebrating 7 years of PixelPlush with a brand new site look!";
    banner.appendChild(message);

    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Dismiss birthday celebration');
    dismiss.textContent = 'x';
    Object.assign(dismiss.style, {
      background: 'rgba(255, 255, 255, 0.35)',
      border: '1px solid rgba(79, 39, 39, 0.25)',
      borderRadius: '50%',
      color: '#4f2727',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      lineHeight: '1',
      padding: '5px 8px 6px',
      position: 'absolute',
      right: '10px',
      top: '8px',
    });
    dismiss.addEventListener('click', () => {
      sessionStorage.setItem(dismissKey, '1');
      removeCelebration();
    });
    banner.appendChild(dismiss);

    const header = document.querySelector('header');
    if (header) header.insertAdjacentElement('afterend', banner);
    else document.body.prepend(banner);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes pp-birthday-fall { 0% { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 100% { transform: translate3d(var(--drift), 112vh, 0) rotate(var(--spin)); opacity: 0.95; } }
      @keyframes pp-birthday-float { 0%, 100% { transform: translate3d(0, 8px, 0); } 50% { transform: translate3d(0, -18px, 0); } }
      @keyframes pp-birthday-twinkle { 0%, 100% { opacity: 0.25; transform: scale(0.6) rotate(0deg); } 50% { opacity: 1; transform: scale(1.35) rotate(45deg); } }
      @keyframes pp-birthday-burst { 0% { opacity: 0; transform: scale(0.25); } 35% { opacity: 1; } 100% { opacity: 0; transform: scale(1.2); } }
      #${layerId} { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 60; }
      #${layerId} i { display: block; position: absolute; }
      #${layerId} .pp-birthday-confetti { animation: pp-birthday-fall var(--duration) cubic-bezier(.2,.7,.25,1) var(--delay) forwards; background: var(--color); border-radius: var(--radius); height: var(--height); left: var(--left); opacity: 0; top: 0; width: var(--width); }
      #${layerId} .pp-birthday-balloon { animation: pp-birthday-float 3.2s ease-in-out var(--delay) infinite; background: var(--color); border-radius: 50% 50% 46% 46%; box-shadow: inset -5px -7px rgba(0,0,0,.1), 0 8px 18px rgba(79,39,39,.16); height: 46px; left: var(--left); top: 13%; width: 34px; }
      #${layerId} .pp-birthday-balloon::after { background: var(--color); content: ''; height: 48px; left: 16px; opacity: .7; position: absolute; top: 43px; width: 1px; }
      #${layerId} .pp-birthday-sparkle { animation: pp-birthday-twinkle 1.4s ease-in-out var(--delay) infinite; color: var(--color, #f4b942); font: 700 26px/1 sans-serif; left: var(--left); top: var(--top); }
      #${layerId} .pp-birthday-burst { animation: pp-birthday-burst 1.8s ease-out var(--delay) infinite; border: 3px solid var(--color); border-radius: 50%; height: 52px; left: var(--left); top: var(--top); width: 52px; }
    `;

    const layer = document.createElement('div');
    layer.id = layerId;
    layer.setAttribute('aria-hidden', 'true');
    layer.appendChild(style);
    addBalloon(layer, colors[0], '7%', '0s');
    addBalloon(layer, colors[1], '88%', '0.7s');
    addBalloon(layer, colors[3], '93%', '1.2s');
    for (let index = 0; index < 12; index += 1) addSparkle(layer, index);
    for (const [left, top, color, delay] of [['14%', '22%', colors[1], '0s'], ['82%', '30%', colors[3], '0.7s'], ['50%', '16%', colors[0], '1.1s']]) {
      const burst = document.createElement('i');
      burst.className = 'pp-birthday-burst';
      burst.style.setProperty('--left', left);
      burst.style.setProperty('--top', top);
      burst.style.setProperty('--color', color);
      burst.style.setProperty('--delay', delay);
      layer.appendChild(burst);
    }
    for (let index = 0; index < 72; index += 1) {
      const piece = document.createElement('i');
      const size = 6 + Math.random() * 8;
      piece.className = 'pp-birthday-confetti';
      piece.style.setProperty('--color', colors[index % colors.length]);
      piece.style.setProperty('--delay', `${Math.random() * 2.2}s`);
      piece.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
      piece.style.setProperty('--duration', `${3.2 + Math.random() * 2.4}s`);
      piece.style.setProperty('--height', `${size * 1.7}px`);
      piece.style.setProperty('--left', `${Math.random() * 100}%`);
      piece.style.setProperty('--radius', index % 4 === 0 ? '50%' : '2px');
      piece.style.setProperty('--spin', `${360 + Math.random() * 1200}deg`);
      piece.style.setProperty('--width', `${size}px`);
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    window.setTimeout(() => layer.remove(), 10000);
  }

  function scheduleCelebration() { window.setTimeout(showCelebration, 1200); }
  if (document.readyState === 'complete') scheduleCelebration();
  else window.addEventListener('load', scheduleCelebration, { once: true });
})();
