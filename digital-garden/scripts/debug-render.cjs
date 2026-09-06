// 调试用：把 realDistricts + realWater + realRoutes 渲染成一张 SVG 检查图
const fs = require('fs');

const read = (p) => fs.readFileSync(p, 'utf-8');

// 提取 realDistricts
const districtsSrc = read('/workspace/digital-garden/src/data/realDistricts.ts');
const districtPaths = [...districtsSrc.matchAll(/path:\s*[`'"]([^`'"]+)[`'"]/g)].map((m) => m[1]);
const vw = (districtsSrc.match(/MAP_VIEW_W\s*=\s*(\d+)/) || [])[1] || 801;
const vh = (districtsSrc.match(/MAP_VIEW_H\s*=\s*(\d+)/) || [])[1] || 1449;

// 提取 realWater（双引号包裹、以 "M " 开头的 path 字符串）
const waterSrc = read('/workspace/digital-garden/src/data/realWater.ts');
const waterPaths = [...waterSrc.matchAll(/"(M [^"]+)"/g)].map((m) => m[1]);

// 提取 realRoutes
const routesSrc = read('/workspace/digital-garden/src/data/realRoutes.ts');
const routeBlocks = [...routesSrc.matchAll(/\{\s*"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",[\s\S]*?"path":\s*"([^"]+)"/g)].map(
  (m) => ({ id: m[1], name: m[2], path: m[3] })
);

console.log('districts:', districtPaths.length, 'water:', waterPaths.length, 'routes:', routeBlocks.length);

const colors = ['#d33', '#36c', '#e80', '#909', '#0a8', '#c4a', '#f60', '#08d', '#6a0'];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${vw}" height="${vh}">
  <rect width="${vw}" height="${vh}" fill="#fafafa"/>
  ${districtPaths.map((d) => `<path d="${d}" fill="#ececec" stroke="#bbb" stroke-width="1"/>`).join('\n  ')}
  ${waterPaths.map((d) => `<path d="${d}" fill="none" stroke="#bcd" stroke-width="2"/>`).join('\n  ')}
  ${routeBlocks
    .map(
      (r, i) =>
        `<path d="${r.path}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`
    )
    .join('\n  ')}
</svg>`;

// 每条路线单独一张小图
const perRoute = routeBlocks
  .map((r, i) => {
    const nums = r.path.match(/-?\d+\.?\d*/g).map(Number);
    const xs = nums.filter((_, k) => k % 2 === 0);
    const ys = nums.filter((_, k) => k % 2 === 1);
    const x0 = Math.min(...xs) - 20, x1 = Math.max(...xs) + 20;
    const y0 = Math.min(...ys) - 20, y1 = Math.max(...ys) + 20;
    return `<div style="display:inline-block;margin:8px;border:1px solid #ccc;background:#fff">
<div style="font:14px sans-serif;padding:4px 8px">${r.name} (${r.id})</div>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" width="300" height="${Math.round((300 * (y1 - y0)) / (x1 - x0))}">
  ${districtPaths.map((d) => `<path d="${d}" fill="#f0f0f0" stroke="#ddd" stroke-width="0.8"/>`).join('')}
  ${waterPaths.map((d) => `<path d="${d}" fill="none" stroke="#cde" stroke-width="1.5"/>`).join('')}
  <path d="${r.path}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="2" stroke-linecap="round"/>
</svg></div>`;
  })
  .join('\n');

fs.writeFileSync(
  '/workspace/digital-garden/debug-routes.html',
  `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;background:#fafafa;font-family:sans-serif}h3{margin:12px}</style></head><body>
<h3>全市总览</h3>${svg}
<h3>单路线检查</h3>${perRoute}
</body></html>`
);
console.log('written debug-routes.html');
