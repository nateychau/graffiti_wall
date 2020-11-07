export const getPosition = function (event, canvas) {
  const bound = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bound.left) / bound.width) * canvas.width,
    y: ((event.clientY - bound.top) / bound.height) * canvas.height,
  };
};

export const isOutOfBound = function (coord, canvas) {
  return (
    coord.x > canvas.width ||
    coord.x < 0 ||
    coord.y > canvas.height ||
    coord.y < 0
  );
};
