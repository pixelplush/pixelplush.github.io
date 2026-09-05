(() => {
  if (window.__pixelPlushBirthdayCelebration) return;
  window.__pixelPlushBirthdayCelebration = true;

  const bannerId = 'pp-birthday-banner';
  const layerId = 'pp-birthday-confetti-layer';
  const dismissKey = 'pp-birthday-7-dismissed';

  function removeCelebration() {
    document.getElementById(bannerId)?.remove();
    document.getElementById(layerId)?.remove();
  }

  function showCelebration() {
    if (sessionStorage.getItem(dismissKey) === '1' || document.getElementById(bannerId)) return;

    const banner = document.createElement('div');
    banner.id = bannerId;
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-label', "PixelPlush's 7th birthday celebration");
    Object.assign(banner.style, {
      alignItems: 'center',
      background: '#fff3c4',
      borderBottom: '1px solid #d19a2d',
      color: '#4f2727',
      display: 'flex',
      fontFamily: 'inherit',
      fontSize: '14px',
      fontWeight: '700',
      gap: '12px',
      justifyContent: 'center',
      minHeight: '42px',
      padding: '8px 48px',
      position: 'relative',
      textAlign: 'center',
      width: '100%',
      zIndex: '25',
    });

    const message = document.createElement('span');
    message.textContent = "Celebrate PixelPlush's 7th birthday!";
    banner.appendChild(message);

    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.setAttribute('aria-label', 'Dismiss birthday celebration');
    dismiss.textContent = 'x';
    Object.assign(dismiss.style, {
      background: 'transparent',
      border: '0',
      color: '#4f2727',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      lineHeight: '1',
      padding: '8px',
      position: 'absolute',
      right: '8px',
      top: '4px',
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
      @keyframes pp-birthday-fall {
        0% { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 0; }
        8% { opacity: 1; }
        100% { transform: translate3d(var(--drift), 112vh, 0) rotate(var(--spin)); opacity: 0.9; }
      }
      #${layerId} { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 60; }
      #${layerId} i {
        animation: pp-birthday-fall var(--duration) linear var(--delay) forwards;
        background: var(--color);
        border-radius: var(--radius);
        height: var(--height);
        left: var(--left);
        opacity: 0;
        position: absolute;
        top: 0;
        width: var(--width);
      }
    `;

    const layer = document.createElement('div');
    layer.id = layerId;
    layer.setAttribute('aria-hidden', 'true');
    layer.appendChild(style);

    const colors = ['#e94f64', '#f4b942', '#2f9c95', '#4f6bd8', '#9c5cc4', '#f07aa9'];
    for (let index = 0; index < 56; index += 1) {
      const piece = document.createElement('i');
      const size = 6 + Math.random() * 7;
      piece.style.setProperty('--color', colors[index % colors.length]);
      piece.style.setProperty('--delay', index === 0 ? '0s' : `${Math.random() * 5}s`);
      piece.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
      piece.style.setProperty('--duration', `${6 + Math.random() * 5}s`);
      piece.style.setProperty('--height', `${size * 1.6}px`);
      piece.style.setProperty('--left', `${Math.random() * 100}%`);
      piece.style.setProperty('--radius', index % 3 === 0 ? '50%' : '2px');
      piece.style.setProperty('--spin', `${360 + Math.random() * 900}deg`);
      piece.style.setProperty('--width', `${size}px`);
      layer.appendChild(piece);
    }

    document.body.appendChild(layer);
    window.setTimeout(() => layer.remove(), 16000);
  }

  function scheduleCelebration() {
    window.setTimeout(showCelebration, 1500);
  }

  if (document.readyState === 'complete') scheduleCelebration();
  else window.addEventListener('load', scheduleCelebration, { once: true });
})();
