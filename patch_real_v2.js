const fs = require("fs");

let code = fs.readFileSync(
	"/Users/admin/Downloads/files/tongji_fotobooth.html",
	"utf8",
);

const targetStr = `				if (mode === "assemble") {`;
const injectStr = `				if (mode === "that-person") {
					const r1 = 180 + 30 * Math.sin(t * 1.5);
					const r2 = 220 + 40 * Math.cos(t * 1.2);
					const r3 = 260 + 30 * Math.sin(t * 1.8);
					return [
						{ x: bodyX + r1 * Math.cos(t * 1.2), y: bodyY + r1 * Math.sin(t * 1.2) },
						{ x: bodyX + r2 * Math.cos(t * 1.5 + 2), y: bodyY + r2 * Math.sin(t * 1.5 + 2) },
						{ x: bodyX + r3 * Math.cos(t * 1.1 + 4), y: bodyY + r3 * Math.sin(t * 1.1 + 4) }
					];
				}
				if (mode === "assemble") {`;

code = code.replace(targetStr, injectStr);

const handposeOn = `					handpose.on("predict", (results) => {`;
const posenetInit = `					const poseNet = ml5.poseNet(video, () => console.log("PoseNet active"));
					poseNet.on("pose", (results) => {
						if (results && results.length > 0) {
							const pose = results[0].pose;
							let bx = pose.nose.x;
							let by = pose.nose.y;
							let pts = 1;
							if (pose.leftShoulder && pose.leftShoulder.confidence > 0.2) {
								bx += pose.leftShoulder.x; by += pose.leftShoulder.y; pts++;
							}
							if (pose.rightShoulder && pose.rightShoulder.confidence > 0.2) {
								bx += pose.rightShoulder.x; by += pose.rightShoulder.y; pts++;
							}
							bx /= pts;
							by /= pts;
							let mappedX = (bx / video.width) * window.innerWidth;
							let mappedY = (by / video.height) * window.innerHeight;
							if (typeof bodyX !== 'undefined') {
								bodyX += ((window.innerWidth - mappedX) - bodyX) * 0.15;
								bodyY += (mappedY - bodyY) * 0.15;
							}
						}
					});
					handpose.on("predict", (results) => {`;

code = code.replace(handposeOn, posenetInit);

fs.writeFileSync("/Users/admin/Downloads/files/tongji_fotobooth.html", code);

// Now for index.html
let idxCode = fs.readFileSync(
	"/Users/admin/Downloads/files/index.html",
	"utf8",
);

if (!idxCode.includes("ml5.min.js")) {
	idxCode = idxCode.replace(
		"</head>",
		`\n<script src="https://unpkg.com/ml5@0.12.2/dist/ml5.min.js"></script>\n</head>`,
	);
}

if (!idxCode.includes('<canvas id="bg"')) {
	idxCode = idxCode.replace("<body>", `<body>\n<canvas id="bg"></canvas>`);
	idxCode = idxCode.replace(
		"/* Custom cursor */",
		`/* Abstract tracking background */\ncanvas#bg { position: fixed; inset: 0; z-index: -1; opacity: 0.8; pointer-events: none; }\n/* Custom cursor */`,
	);

	// Add logic at the end
	const logic = `
const bgCnv = document.getElementById('bg');
const bgCtx = bgCnv.getContext('2d');
let W, H;
function resizeBg() {
  W = bgCnv.width = window.innerWidth;
  H = bgCnv.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

let bodyX = W/2, bodyY = H/2;
let t = 0;

const video = document.createElement('video');
video.autoplay = true; video.playsInline = true; video.muted = true;
video.width = 640; video.height = 360;

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width:640, height:360 } })
  .then(stream => {
      video.srcObject = stream;
      video.play();
      const poseNet = ml5.poseNet(video, () => console.log('PoseNet ready'));
      poseNet.on('pose', results => {
          if (results && results.length > 0) {
              const pose = results[0].pose;
              let bx = pose.nose.x;
              let by = pose.nose.y;
              let pts = 1;
              if (pose.leftShoulder && pose.leftShoulder.confidence > 0.2) {
                  bx += pose.leftShoulder.x; by += pose.leftShoulder.y; pts++;
              }
              if (pose.rightShoulder && pose.rightShoulder.confidence > 0.2) {
                  bx += pose.rightShoulder.x; by += pose.rightShoulder.y; pts++;
              }
              bx /= pts; by /= pts;
              let mappedX = (bx / video.width) * W;
              let mappedY = (by / video.height) * H;
              // Mirror coordinates
              bodyX += ((W - mappedX) - bodyX) * 0.1;
              bodyY += (mappedY - bodyY) * 0.1;
          }
      });
  })
  .catch(err => console.log('Camera error', err));

function drawShape(ctx, fn, cx, cy, sc, layerCount, depth, angle, hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  const dx = Math.cos(angle), dy = -Math.sin(angle)*0.45;
  for(let i = layerCount-1; i >= 0; i--) {
      const f = 0.1 + (i / Math.max(layerCount-1, 1)) * 0.9;
      ctx.fillStyle = \`rgba(\${r*f},\${g*f},\${b*f}, 0.35)\`;
      ctx.save();
      ctx.translate(cx + dx * i * depth, cy + dy * i * depth);
      ctx.scale(sc, sc);
      fn(ctx);
      ctx.fill();
      ctx.restore();
  }
}

function drawOne(ctx) {
  ctx.beginPath();
  ctx.moveTo(8,-88); ctx.bezierCurveTo(24,-85,30,-58,26,-24);
  ctx.bezierCurveTo(22,10,20,42,22,84); ctx.lineTo(-10,84);
  ctx.bezierCurveTo(-16,42,-18,8,-20,-24); ctx.bezierCurveTo(-22,-58,-14,-84,8,-88);
  ctx.closePath();
  ctx.moveTo(-4,-62); ctx.bezierCurveTo(-16,-70,-36,-66,-44,-52);
  ctx.bezierCurveTo(-40,-40,-22,-43,-8,-45); ctx.closePath();
}

function drawTwo(ctx) {
  ctx.beginPath();
  ctx.moveTo(-30,-40); ctx.bezierCurveTo(-32,-85,8,-95,30,-68);
  ctx.bezierCurveTo(52,-42,36,-8,14,14); ctx.bezierCurveTo(-4,32,-16,50,0,64);
  ctx.lineTo(44,64); ctx.lineTo(44,84); ctx.lineTo(-44,84); ctx.lineTo(-44,62);
  ctx.bezierCurveTo(-28,46,-14,28,6,10); ctx.bezierCurveTo(20,-6,18,-30,4,-44);
  ctx.bezierCurveTo(-10,-58,-26,-54,-30,-40); ctx.closePath();
}

function drawCircle(ctx,r) { ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.closePath(); }

function loopBg() {
  t += 0.012;
  bgCtx.clearRect(0,0,W,H);
  
  const r1 = 180 + 40 * Math.sin(t * 1.5);
  const r2 = 230 + 50 * Math.cos(t * 1.2);
  const r3 = 280 + 30 * Math.sin(t * 1.8);

  const t1 = { x: bodyX + r1 * Math.cos(t * 1.2), y: bodyY + r1 * Math.sin(t * 1.2), a: t*0.8, hex: '#E8190C', fn: drawOne };
  const t2 = { x: bodyX + r2 * Math.cos(t * 1.5 + 2), y: bodyY + r2 * Math.sin(t * 1.5 + 2), a: t*1.1, hex: '#1A5CBE', fn: drawTwo };
  const t3 = { x: bodyX + r3 * Math.cos(t * 1.1 + 4), y: bodyY + r3 * Math.sin(t * 1.1 + 4), a: t*1.4, hex: '#E8C340', fn: c=>drawCircle(c,55) };
  
  drawShape(bgCtx, t1.fn, t1.x, t1.y, 0.7, 5, 2, t1.a, t1.hex);
  drawShape(bgCtx, t2.fn, t2.x, t2.y, 0.7, 5, 2, t2.a, t2.hex);
  drawShape(bgCtx, t3.fn, t3.x, t3.y, 0.7, 5, 2, t3.a, t3.hex);

  requestAnimationFrame(loopBg);
}
loopBg();
</script>
</body>`;
	idxCode = idxCode.replace("</body>", logic);
	fs.writeFileSync("/Users/admin/Downloads/files/index.html", idxCode);
}
