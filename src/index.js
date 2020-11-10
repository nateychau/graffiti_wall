import * as Util from "./util.js";

let drawing = false;
let coord;
let brushSize = 5;
let brushSizeRate = 0.1;
let pauseTime = 0;
let xLast;
let yLast;
const spraySize = 10;
const HOLD_THRESHOLD = 50;
const SPRAY_DENSITY = 50;
let sprayId = 0;
let onHold = false;

window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");
  const colorPicker = new iro.ColorPicker('#picker');
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = colorPicker.color.hexString;
  colorPicker.on('color:change', function(color){
    ctx.fillStyle = color.hexString;
  })


  const spray = function () {
    for (let i = 0; i < SPRAY_DENSITY; i++) {
      const noise = Util.rndSprayParticle(spraySize);
      const x = coord.x + noise.x;
      const y = coord.y + noise.y;
      ctx.fillRect(x, y, 1, 1);
      // console.log("count");
    }
  };

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    coord = Util.getPosition(e, canvas); //get start point for line
    ctx.moveTo(coord.x, coord.y);
    xLast = coord.x;
    yLast = coord.y;
    ctx.lineWidth = 5;
    spray();
  });

  document.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    clearInterval(sprayId);
    coord = Util.getPosition(e, canvas);
    spray();
    // const dx = coord.x - xLast;
    // const dy = coord.y - yLast;

    sprayId = setInterval(spray, 20);
    // ctx.lineCap = "round";
    // ctx.strokeStyle = "black";

    // ctx.lineTo(coord.x, coord.y);
    // ctx.stroke();
  });

  document.addEventListener("mouseup", (e) => {
    if (!drawing) return;
    clearInterval(sprayId);
    drawing = false;
  });
});
