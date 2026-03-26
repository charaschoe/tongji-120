const fs = require("fs");

let code = fs.readFileSync(
	"/Users/admin/Downloads/files/tongji_poster_machine.html",
	"utf8",
);

const targetMenu = `    <div class="ctrl">
      <label>Color Mode</label>`;

const injectMenu = `    <div class="ctrl">
      <label>Layout Mode</label>
      <div class="pills">
        <button class="pill on" data-logo="deconstructed">Deconstructed</button>
        <button class="pill" data-logo="unified">Unified</button>
      </div>
    </div>
    <div class="ctrl">
      <label>Color Mode</label>`;

code = code.replace(targetMenu, injectMenu);

const pStateLine = `let P = {`;
code = code.replace(pStateLine, `let P = { logo: 'deconstructed',`);

const bindLogo = `  document.querySelectorAll('[data-bg]').forEach(b => {`;
const bindInject = `  document.querySelectorAll('[data-logo]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-logo]').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      P.logo = b.dataset.logo;
    });
  });
  document.querySelectorAll('[data-bg]').forEach(b => {`;

code = code.replace(bindLogo, bindInject);

// Now for the drawing logic
const shapesCode = `// ─── SHAPES ────────────────────────────────────────────────

const unifiedPaths = {
  blue: new Path2D("M1836.42 220.025C1561.47 150.445 1204.17 437.42 1022.69 581.494C865.059 706.625 561.199 1004.48 393.108 1289.9C375.819 1319.26 350.615 1344.24 391.355 1377.13C435.855 1413.05 454.731 1444.98 478.112 1424.36C501.493 1403.74 888.887 956.569 1034.25 857.461C1179.62 758.354 1383.06 730.171 1444.78 837.852C1506.49 945.534 1219.47 2108.34 1188.55 2197.64C1157.63 2286.94 1268 2352.99 1316.33 2319.32C1364.65 2285.65 1944.03 1735.67 2135.79 1536.17C2327.55 1336.68 2345.67 1261.87 2287.39 1218.63C2229.11 1175.38 2065.05 1317.83 1991.45 1372.51C1917.85 1427.19 1832.32 1452.74 1859.59 1326.69C1886.87 1200.63 2111.38 289.604 1836.42 220.025Z"),
  red: new Path2D("M486.387 295.832C386.996 526.896 185.856 812.621 2.83843 868.227C-0.0495876 869.105 -0.983935 872.681 1.20767 874.756C26.9284 899.114 96.1585 947.787 204.741 980.493C317.384 1014.42 445.018 963.774 499.547 931.68C501.916 930.285 504.943 931.441 505.543 934.125C590.604 1314.68 764.832 2084.59 790.785 2162.33C823.378 2259.95 863.265 2286.42 918.585 2259.68C973.905 2232.94 1156.81 1507.69 1150.25 1479.44C1143.69 1451.19 975.265 597.644 935.796 427.669C892.708 242.108 863.465 -12.0419 741.321 0.442209C619.177 12.9263 586.928 62.0956 486.387 295.832Z"),
  gold: new Path2D("M2285.66 167.961C2551.81 4.05203 2931.72 90.115 3119.86 395.602C3307.99 701.089 3293.76 1072.97 2966.95 1274.23C2700.8 1438.14 2332.53 1323.37 2144.4 1017.88C1956.26 712.391 2019.51 331.87 2285.66 167.961Z")
};

function pathOne(ctx) {`;
code = code.replace(
	`// ─── SHAPES ────────────────────────────────────────────────\n\nfunction pathOne(ctx) {`,
	shapesCode,
);

const drawUnifiedObj = `  function unifiedPathBlue(ctx) {
    ctx.fill(unifiedPaths.blue);
  }
  function unifiedPathRed(ctx) {
    ctx.fill(unifiedPaths.red);
  }
  function unifiedPathGold(ctx) {
    ctx.fill(unifiedPaths.gold);
  }`;

code = code.replace(
	`// ─── UTILS ─────────────────────────────────────────────────`,
	drawUnifiedObj +
		`\n\n// ─── UTILS ─────────────────────────────────────────────────`,
);

const renderLogicSearch = `    // Circle (back)
    layered((c)=>pathCircle(c,75), cx+190*sc, cy-22*sc,
      sc, P.layers, P.depth, tRad, P.angle, P.mode, 2, BASE.gold);

    // Blue 2 (middle)
    layered(pathTwo, cx+30*sc, cy,
      sc, P.layers, P.depth, tRad, P.angle, P.mode, 1, BASE.blue);

    // Red 1 (front/left)
    layered(pathOne, cx-132*sc, cy,
      sc, P.layers, P.depth, tRad, P.angle, P.mode, 0, BASE.red);`;

const updatedRenderLogic = `    if (P.logo === 'deconstructed') {
      layered((c)=>pathCircle(c,75), cx+190*sc, cy-22*sc,
        sc, P.layers, P.depth, tRad, P.angle, P.mode, 2, BASE.gold);
      layered(pathTwo, cx+30*sc, cy,
        sc, P.layers, P.depth, tRad, P.angle, P.mode, 1, BASE.blue);
      layered(pathOne, cx-132*sc, cy,
        sc, P.layers, P.depth, tRad, P.angle, P.mode, 0, BASE.red);
    } else {
      ctx.save();
      // Center the 3242x2329 bounding box in the context before repeating scale
      const bboxW = 3242;
      const bboxH = 2329;
      // Normal scale applies to individual shapes around their given center.
      // We will make layered() apply translations, but instead of individual centers, 
      // they all share the center cx, cy.
      const unifiedScale = sc * 0.16; // arbitrary scale factor to match similar size
      
      // We need to translate the SVG to its center, so inside unifiedPath methods we should have pre-translated.
      // Let's wrap them in inline functions here that account for the bbox center.
      const wC = bboxW / 2;
      const hC = bboxH / 2;
      
      const drawB = (c) => { c.translate(-wC, -hC); c.fill(unifiedPaths.blue); };
      const drawR = (c) => { c.translate(-wC, -hC); c.fill(unifiedPaths.red); };
      const drawG = (c) => { c.translate(-wC, -hC); c.fill(unifiedPaths.gold); };
      
      layered(drawG, cx, cy - 30 * sc,
        unifiedScale, P.layers, P.depth, tRad, P.angle, P.mode, 2, BASE.gold);
      layered(drawB, cx, cy - 30 * sc,
        unifiedScale, P.layers, P.depth, tRad, P.angle, P.mode, 1, BASE.blue);
      layered(drawR, cx, cy - 30 * sc,
        unifiedScale, P.layers, P.depth, tRad, P.angle, P.mode, 0, BASE.red);
      
      ctx.restore();
    }`;

code = code.replace(renderLogicSearch, updatedRenderLogic);

fs.writeFileSync(
	"/Users/admin/Downloads/files/tongji_poster_machine.html",
	code,
);
