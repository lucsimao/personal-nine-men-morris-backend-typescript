export const scalePosition = (position, size, margin) => {
  let result = position * (size - 2 * margin) + margin;
  return result;
};

export const scaleClick = (x, y, size, screen) => {
  const rect = screen.getBoundingClientRect();

  return [
    ((x - rect.left) * size) / rect.width,
    ((y - rect.top) * size) / rect.width,
  ];
};

export const isOverCircle = (circle, x, y) => {
  const equation = Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2);
  const radiusPow = Math.pow(circle.radius, 2);
  const result = equation < radiusPow;

  return result;
};
