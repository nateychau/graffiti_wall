export function takeSnapshot(canvas) {
  // const downloadBtn = document.getElementById("download")
  return () => {
    const link = document.getElementById('download-link');
    link.download = "some_filename.png"
    link.href = canvas.toDataURL("image/png")
    // link.click();
  }
}

