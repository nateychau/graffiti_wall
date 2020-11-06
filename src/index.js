import * as Util from './util.js';

let drawing = false;
let coord;  

window.addEventListener('DOMContentLoaded', (event) => {
  
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.addEventListener('mousedown', (e) => {
    drawing = true; 
    coord = Util.getPosition(e, canvas); //get start point for line
  })
  
  canvas.addEventListener('mousemove', (e) => {
    if(!drawing) return
    
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.moveTo(coord.x, coord.y);
    coord = Util.getPosition(e, canvas);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
  })

  canvas.addEventListener('mouseup', (e) => {
    if(!drawing) return

    drawing = false;


  })
})