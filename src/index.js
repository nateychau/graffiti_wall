import * as Util from "./util.js";
import { takeSnapshot } from "./screen-capture";

let drawing = false;
let playSound = false;
let coord;
let mouseCoord;
let brushSize = 5;
let brushSizeRate = 0.1;
let pauseTime = 0;
let xLast;
let yLast;
let spraySize = 5;
const HOLD_THRESHOLD = 50;
let SPRAY_DENSITY_MEDIAN = 2 * Math.PI * spraySize ** 2;
let SPRAY_DENSITY_RATIO = 1;
let SPRAY_DENSITY = SPRAY_DENSITY_RATIO * SPRAY_DENSITY_MEDIAN;
let sprayId = 0;
let onHold = false;

window.addEventListener("DOMContentLoaded", (event) => {
  const mouseCanvas = document.getElementById("mouse-canvas");
  const mouseCtx = mouseCanvas.getContext("2d");
  const mainCanvas = document.getElementById("canvas");
  const ctx = mainCanvas.getContext("2d");

  //---------Spray sound properties--------------
  const spraySound = new Audio();
  spraySound.src = "https://raw.githubusercontent.com/nateychau/graffiti_wall/main/dist/assets/spray_sound.mp3";
  spraySound.addEventListener('loadeddata', () => playSound = true);

  spraySound.loop = true;
  spraySound.volume = 0.45;
  //Event listener for semi-gapless looping
  spraySound.addEventListener("timeupdate", function (e) {
    var buffer = 0.5;
    if (
      playSound &&
      !this.paused &&
      this.currentTime > this.duration - buffer
    ) {
      this.currentTime = 1;
      this.play();
    }
  });
  //Audio on/off controls
  const soundButton = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");
  soundButton.addEventListener("click", function () {
    if (playSound) {
      soundIcon.classList.remove("fa-volume-up");
      soundIcon.classList.add("fa-volume-mute");
      playSound = false;
    } else {
      soundIcon.classList.remove("fa-volume-mute");
      soundIcon.classList.add("fa-volume-up");
      playSound = true;
    }
  });

  //-------------Toolbar toggle-------------------------
  let toolbarOpen = false;
  const toolbarContainer = document.getElementById("toolbar-container");
  const toolbarIcon = document.getElementById("toolbar-icon");
  const toolbarButton = document.getElementById("toolbar-toggle");
  const backpackImg = document.getElementsByClassName("backpack-img")[0];
  let backpackInterval = null;

  toolbarButton.addEventListener("click", function () {
    toolbarContainer.classList.toggle("is-open");
    // toolbarButton.classList.toggle("big-btn")
    if (toolbarOpen) {
      // toolbarIcon.classList.remove("fa-caret-left");
      // toolbarIcon.classList.add("fa-caret-right");
      backpackImg.classList.remove("rotate");
      window.clearInterval(backpackInterval);
      toolbarOpen = false;
    } else {
      // toolbarIcon.classList.remove("fa-caret-right");
      // toolbarIcon.classList.add("fa-caret-left");
      backpackInterval = window.setInterval(() => {
        backpackImg.classList.toggle("rotate");
      }, 850);
      toolbarOpen = true;
    }
  });

  //------------ headshots ------------------------------
  // const headshots = document.querySelectorAll('.headshot');
  // let headshotHover
  // headshots.forEach(headshot => {
  //   headshot.addEventListener("mouseover", function () {
  //     headshotHover = window.setInterval(() => {
  //       headshot.classList.toggle("rotate");
  //     }, 500);
  //   })
      
  //     headshot.addEventListener("mouseout", function () {
  //       headshot.classList.remove("rotate");
  //       window.clearInterval(headshotHover);
  //     })
  // })

  //-----------Restart functionality-------------------
  const trashButton = document.getElementById("trash-btn");
  trashButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //!!add additional logic for resetting background
  });

  //------------Color picker related set up--------------
  const colorPicker = new iro.ColorPicker("#picker", {
    width: 150,
    color: "#FFD700",
    display: "inline-block",
    id: "picker-circle",
  });
  //event listener for color picker
  ctx.fillStyle = colorPicker.color.hexString;
  mouseCtx.fillStyle = colorPicker.color.hexString;
  mouseCtx.strokeStyle = '#262624';
  colorPicker.on("color:change", function (color) {
    ctx.fillStyle = color.hexString;
    mouseCtx.fillStyle = color.hexString;
  });

  //-------------------Slider event listeners-----------------------

  //Reticle slider handles need to be tweaked
  const reticleSlider = document.getElementById("reticle-slider");
  reticleSlider.oninput = function (e) {
    spraySize = e.target.value / 8;
    SPRAY_DENSITY_MEDIAN = 2 * Math.PI * spraySize ** 2;
    SPRAY_DENSITY = SPRAY_DENSITY_RATIO * SPRAY_DENSITY_MEDIAN;


    mouseCtx.clearRect(0,0, mouseCanvas.width, mouseCanvas.height);   
    mouseCtx.beginPath();
    mouseCtx.arc(mouseCoord.x, mouseCoord.y, spraySize+8, 0, 2*Math.PI);
    mouseCtx.stroke();
    mouseCtx.fill();
  };

  //Density is controlled by a range input slider.
  //(We can adjust min and max values of the slider, currently 1-100, default 50)
  const densitySlider = document.getElementById("density-slider");
  densitySlider.oninput = function (e) {
    SPRAY_DENSITY_RATIO = e.target.value / 50;
    SPRAY_DENSITY = SPRAY_DENSITY_RATIO * SPRAY_DENSITY_MEDIAN;
  };

  //-----------------------------------------------------------

  // ----------------Download Button ------------------------------

  const downloadImgBtn = document.getElementById("download-img-btn");
  downloadImgBtn.addEventListener("click", () => {
    takeSnapshot();
  });

  //-----------------------------------------------------------

  const spray = function () {
    for (let i = 0; i < SPRAY_DENSITY; i++) {
      const noise = Util.rndSprayParticle(spraySize);
      const x = coord.x + noise.x;
      const y = coord.y + noise.y;
      ctx.fillRect(x, y, 1, 1);
    }
    console.log("count");
  };

  mouseCanvas.addEventListener("mousemove", (e) => {
    mouseCtx.clearRect(0,0, mouseCanvas.width, mouseCanvas.height);
    mouseCoord = Util.getPosition(e, mouseCanvas);     
    mouseCtx.beginPath();
    mouseCtx.arc(mouseCoord.x, mouseCoord.y, spraySize+8, 0, 2*Math.PI);
    mouseCtx.stroke();
    mouseCtx.fill();
  })

  mouseCanvas.addEventListener("mousedown", (e) => {
    drawing = true;
    coord = Util.getPosition(e, canvas); //get start point for line
    ctx.moveTo(coord.x, coord.y);
    xLast = coord.x;
    yLast = coord.y;
    ctx.lineWidth = 5;

    sprayId = setInterval(spray, 20);

    if (playSound) {
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
