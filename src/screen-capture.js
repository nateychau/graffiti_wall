import html2canvas from "html2canvas";

export function takeSnapshot() {
  let canvasContainer = document.getElementById("canvas-container")
  html2canvas(canvasContainer).then((canvas) => {
    // we can name the file whatever we want (graffiti.png)
    saveAs(canvas.toDataURL(), 'amazing-creation.png');
  });
}

// looks like theres no other way to create download request besides using
// <a> element's .download attribute 
function saveAs(uri, filename) {
  var link = document.createElement("a");
  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;

    //Firefox requires the link to be in the body
    document.body.appendChild(link);

    //simulate click
    link.click();

    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}
