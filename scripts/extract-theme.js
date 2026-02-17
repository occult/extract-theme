// Run this in Chrome DevTools Console on any website.
// It copies a full theme extraction JSON to your clipboard.
(() => {
  const res = { typography: [], spacing: [], gradients: [], shadows: [], borders: [], radii: [], colors: new Set() };
  const typoMap = new Map(), spacingMap = new Map(), radiiMap = new Map();
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    const tk = `${s.fontSize}|${s.fontWeight}|${s.lineHeight}|${s.letterSpacing}`;
    if (!typoMap.has(tk)) typoMap.set(tk, { fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, tag: el.tagName, sample: el.textContent?.trim().slice(0, 30) });
    ['padding','margin','gap'].forEach(p => { const v = s[p]; if (v && v !== '0px' && v !== 'normal') spacingMap.set(v, (spacingMap.get(v)||0)+1); });
    if (s.backgroundImage !== 'none' && s.backgroundImage.includes('gradient')) res.gradients.push(s.backgroundImage);
    if (s.boxShadow !== 'none') res.shadows.push(s.boxShadow);
    if (s.borderStyle !== 'none' && s.borderWidth !== '0px') res.borders.push(`${s.borderWidth} ${s.borderStyle} ${s.borderColor} r:${s.borderRadius}`);
    if (s.borderRadius !== '0px') radiiMap.set(s.borderRadius, (radiiMap.get(s.borderRadius)||0)+1);
    [s.color, s.backgroundColor, s.borderColor].forEach(c => { if (c && c !== 'rgba(0, 0, 0, 0)') res.colors.add(c); });
  });
  res.typography = [...typoMap.values()].sort((a, b) => parseFloat(b.fontSize) - parseFloat(a.fontSize)).slice(0, 20);
  res.spacing = [...spacingMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([v, c]) => ({ value: v, count: c }));
  res.radii = [...radiiMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([v, c]) => ({ radius: v, count: c }));
  res.gradients = [...new Set(res.gradients)];
  res.shadows = [...new Set(res.shadows)];
  res.borders = [...new Set(res.borders)].slice(0, 15);
  res.colors = [...res.colors];
  copy(JSON.stringify(res, null, 2));
  console.log('Copied full theme extraction to clipboard');
})();
