export const getPosition = (event, canvas) => { 
  let x = event.clientX - canvas.offsetLeft; 
  let y = event.clientY - canvas.offsetTop; 
  return {x, y}
}
