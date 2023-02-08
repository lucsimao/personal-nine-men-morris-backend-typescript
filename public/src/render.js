import { scalePosition } from "./services.js";

export const drawBackground = (context, size, margin) => {
  context.fillStyle = "white";
  context.clearRect(0, 0, size, size);
  for (let i = 0; i < 3; i++) {
    context.beginPath();
    context.fillStyle = "red";
    context.moveTo(
      scalePosition(0 + i * 0.15, size, margin),
      scalePosition(0 + i * 0.15, size, margin)
    );
    context.lineTo(
      scalePosition(1 - i * 0.15, size, margin),
      scalePosition(0 + i * 0.15, size, margin)
    );
    context.lineTo(
      scalePosition(1 - i * 0.15, size, margin),
      scalePosition(0 + i * 0.15, size, margin)
    );
    context.lineTo(
      scalePosition(1 - i * 0.15, size, margin),
      scalePosition(1 - i * 0.15, size, margin)
    );
    context.lineTo(
      scalePosition(0 + i * 0.15, size, margin),
      scalePosition(1 - i * 0.15, size, margin)
    );
    context.lineTo(
      scalePosition(0 + i * 0.15, size, margin),
      scalePosition(0 + i * 0.15, size, margin)
    );
    context.stroke();
  }

  context.beginPath();
  context.fillStyle = "red";
  context.moveTo(
    scalePosition(0, size, margin),
    scalePosition(0.5, size, margin)
  );
  context.lineTo(
    scalePosition(0.3, size, margin),
    scalePosition(0.5, size, margin)
  );
  context.moveTo(
    scalePosition(0.5, size, margin),
    scalePosition(0, size, margin)
  );
  context.lineTo(
    scalePosition(0.5, size, margin),
    scalePosition(0.3, size, margin)
  );
  context.moveTo(
    scalePosition(0.7, size, margin),
    scalePosition(0.5, size, margin)
  );
  context.lineTo(
    scalePosition(1, size, margin),
    scalePosition(0.5, size, margin)
  );
  context.moveTo(
    scalePosition(0.5, size, margin),
    scalePosition(0.7, size, margin)
  );
  context.lineTo(
    scalePosition(0.5, size, margin),
    scalePosition(1, size, margin)
  );
  context.stroke();
};

export const drawCircle = (circle, context) => {
  context.fillStyle = circle.color;
  context.beginPath();
  context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  context.fill();
  context.stroke();
};

export const renderBoard = (nodes, context, size, margin) => {
  drawBackground(context, size, margin);
  for (const node of nodes) {
    if (node) {
      const x = scalePosition(node.x, size, margin);
      const y = scalePosition(node.y, size, margin);
      drawCircle(
        {
          x,
          y,
          radius: node.size,
          color: node.color,
        },
        context
      );
    }
  }
};
