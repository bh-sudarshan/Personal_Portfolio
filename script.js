(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- typing effect ---------- */
  const text = 'COMING SOON';
  const el = document.getElementById('typed');
  const h1 = document.querySelector('.glitch');
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      setTimeout(type, 90 + Math.random() * 80);
    } else if (!reduce) {
      setInterval(() => {
        h1.classList.add('on');
        setTimeout(() => h1.classList.remove('on'), 520);
      }, 4200);
    }
  }
  reduce ? (el.textContent = text) : type();

  /* ---------- network canvas ---------- */
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    const count = Math.min(110, Math.floor((innerWidth * innerHeight) / 14000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .35 * dpr,
      vy: (Math.random() - .5) * .35 * dpr,
      r: (Math.random() * 1.3 + .6) * dpr
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const maxD = 150 * dpr;

    for (const n of nodes) {
      if (!reduce) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,255,163,.85)';
      ctx.fill();
    }

    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
        const d = Math.hypot(dx, dy);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(0,255,163,${(1 - d / maxD) * .22})`;
          ctx.lineWidth = dpr * .6;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }
      const mx = nodes[a].x - mouse.x, my = nodes[a].y - mouse.y;
      const md = Math.hypot(mx, my);
      if (md < 180 * dpr) {
        ctx.strokeStyle = `rgba(0,184,255,${(1 - md / (180 * dpr)) * .5})`;
        ctx.lineWidth = dpr * .8;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  addEventListener('resize', () => { resize(); if (reduce) frame(); });
  addEventListener('pointermove', e => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
  addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  resize();
  frame();
})();
