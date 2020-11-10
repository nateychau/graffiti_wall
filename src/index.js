import * as Util from "./util.js";

let drawing = false;
let playSound = true;
let coord;
let brushSize = 5;
let brushSizeRate = 0.1;
let pauseTime = 0;
let xLast;
let yLast;
let spraySize = 10;
const HOLD_THRESHOLD = 50;
let SPRAY_DENSITY = 50;
let sprayId = 0;
let onHold = false;

window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");

  //Spray sound properties
  const spraySound = new Audio();
  spraySound.src = '../dist/assets/spray_sound.mp3';
  spraySound.loop = true;
  spraySound.volume = 0.45;
  //Event listener for semi-gapless looping
  spraySound.addEventListener('timeupdate', function(e){
    var buffer = .5
    if(playSound && !this.paused && this.currentTime > this.duration - buffer){
        this.currentTime = 1
        this.play()
    }
  });

  //Audio on/off controls
  const soundButton = document.getElementById("sound-icon");
  soundButton.addEventListener('click', function(){
    if(playSound){
      this.classList.remove('fa-volume-up');
      this.classList.add('fa-volume-mute');
      playSound = false;
    } else {
      this.classList.remove('fa-volume-mute');
      this.classList.add('fa-volume-up');
      playSound = true;
    }
  })

  const colorPicker = new iro.ColorPicker('#picker', {
    width: 100
  });
  const ctx = canvas.getContext("2d");

  //event listener for color picker
  ctx.fillStyle = colorPicker.color.hexString;
  colorPicker.on('color:change', function(color){
    ctx.fillStyle = color.hexString;
  })

  //Density is controlled by a range input slider. (We can adjust min and max values of the slider, currently 1-100, default 50)
  const densitySlider = document.getElementById("density-slider");
  densitySlider.oninput = function(e){
    SPRAY_DENSITY = e.target.value;
    console.log(SPRAY_DENSITY);
  }

  //Reticle slider handles need to be tweaked
  const reticleSlider = document.getElementById("reticle-slider");
  reticleSlider.oninput = function(e){
    spraySize = e.target.value/2; 
    SPRAY_DENSITY = spraySize;
  }


  const spray = function () {
    for (let i = 0; i < SPRAY_DENSITY; i++) {
      const noise = Util.rndSprayParticle(spraySize);
      const x = coord.x + noise.x;
      const y = coord.y + noise.y;
      ctx.fillRect(x, y, 1, 1);
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
    if(playSound){
      spraySound.play();
    }
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
    spraySound.pause();
  });
});
