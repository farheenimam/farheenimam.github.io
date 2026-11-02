// Loads data/stats.json (refreshed by the GitHub Action) and fills the stats pages.
// If the file is missing, the hardcoded values in each page stay as they are.
(async () => {
  let d;
  try {
    const r = await fetch('data/stats.json', { cache: 'no-store' });
    if (!r.ok) return;
    d = await r.json();
  } catch (e) {
    return;
  }

  const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('en-US') : String(v));
  document.querySelectorAll('[data-stat]').forEach((el) => {
    const v = d[el.dataset.stat];
    if (v !== undefined) el.textContent = fmt(v);
  });

  const langs = document.getElementById('langs');
  if (langs && Array.isArray(d.languages) && d.languages.length) {
    const colors = ['var(--pink)', 'var(--bright)', 'var(--violet)', 'var(--muted)', 'var(--lavender)'];
    langs.innerHTML = d.languages.map((l, i) => {
      const bg = i === 0 ? 'linear-gradient(90deg, var(--violet), var(--pink))' : colors[i];
      return `<div class="lang" style="color: ${colors[i]}">
          <div class="lang-name"><span class="dot"></span>${l.name}</div>
          <div class="bar"><div class="fill" style="--w: ${l.pct}%; background: ${bg};"></div></div>
          <div class="pct">${l.pct}%</div>
        </div>`;
    }).join('');
  }

  const cells = document.querySelectorAll('#grid .cell');
  if (cells.length && Array.isArray(d.levels) && d.levels.length === cells.length) {
    cells.forEach((c, i) => {
      const l = d.levels[i];
      c.className = 'cell' + (l ? ' l' + l : '');
    });
  }
})();
