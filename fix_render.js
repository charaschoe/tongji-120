const fs = require('fs');
let code = fs.readFileSync('/Users/admin/Downloads/files/tongji_poster_machine.html', 'utf8');

const target = `  // Circle (back)
  layered((c)=>pathCircle(c,75), cx+190*sc, cy-22*sc,
    sc, P.layers, P.depth, tRad, P.angle, P.mode, 2, BASE.gold);

  // Blue 2 (middle)
  layered(pathTwo, cx+30*sc, cy,
    sc, P.layers, P.depth, tRad, P.angle, P.mode, 1, BASE.blue);

  // Red 1 (front/left)
  layered(pathOne, cx-132*sc, cy,
    sc, P.layers, P.depth, tRad, P.angle, P.mode, 0, BASE.red);`;

const updated = `  if (P.logo === 'deconstructed') {
    // Circle (back)
    layered((c)=>pathCircle(c,75), cx+190*sc, cy-22*sc,
      sc, P.layers, P.depth, tRad, P.angle, P.mode, 2, BASE.gold);

    // Blue 2 (middle)
    layered(pathTwo, cx+30*sc, cy,
      sc, P.layers, P.depth, tRad, P.angle, P.mode, 1, BASE.blue);

    // Red 1 (front/left)
    layered(pathOne, cx-132*sc, cy,
      sc, P.layers, P.depth, tRad, P.angle, P.mode, 0, BASE.red);
  } else {
    ctx.save();
    // Center the 3242x2329 bounding box in the context before repeating scale
    const bboxW = 3242;
    const bboxH = 2329;
    // Normal scale applies to individual shapes around their given center.
    // They all share the center cx, cy.
    const unifiedScale = sc * 0.16; // arbitrary scale factor to match similar size
      
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

if (code.includes('if (P.logo === "deconstructed\')')) {
    console.log('Already successfully replaced!');
} else {
    code = code.replace(target, updated);
    fs.writeFileSync('/Users/admin/Downloads/files/tongji_poster_machine.html', code);
    console.log('Fixed render logic!');
}