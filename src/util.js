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

//Use Box–Muller transform to create rnd particle pairs with guassian distribution
export const rndSprayParticle = function (sigma) {
  const u1 = Math.random();
  const u2 = Math.random();
  const mag = sigma * Math.sqrt(-2 * Math.log(u1));
  const x = mag * Math.cos(2 * Math.PI * u2);
  const y = mag * Math.sin(2 * Math.PI * u2);
  return { x, y };
};
