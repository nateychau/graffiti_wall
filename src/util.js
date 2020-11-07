export const getPosition = (event, canvas) => {
  const bound = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bound.left) / bound.width) * canvas.width,
    y: ((event.clientY - bound.top) / bound.height) * canvas.height,
  };
};
