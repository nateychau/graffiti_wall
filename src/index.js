import * as Util from "./util.js";

let drawing = false;
let coord;

window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    coord = Util.getPosition(e, canvas); //get start point for line
    ctx.moveTo(coord.x, coord.y);
  });

  document.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    coord = Util.getPosition(e, canvas);

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
  });

  document.addEventListener("mouseup", (e) => {
    if (!drawing) return;

    drawing = false;
  });
});
