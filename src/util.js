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

export const sprayParticle = function (radius) {
  const theta = Math.random() * Math.PI * 2;
  const r = Math.random() * radius;
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);
  return { x, y };
};
