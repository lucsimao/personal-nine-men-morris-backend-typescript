import { renderBoard } from './render.js';
import { isOverCircle, scaleClick, scalePosition } from './services.js';

const screen = document.getElementById('screen');
const context = screen.getContext('2d');
const socket = io();

const nodeRadius = 6;
const selectedNodeRadius = 12;
const margin = 40;
const size = 500;
let giveUp = false;

let nodes = [
  { id: 17, x: 0.0, y: 0.0, size: nodeRadius, color: 'black' },
  { id: 24, x: 0.5, y: 0.0, size: nodeRadius, color: 'black' },
  { id: 22, x: 1.0, y: 0.0, size: nodeRadius, color: 'black' },

  { id: 18, x: 0.0, y: 0.5, size: nodeRadius, color: 'black' },
  { id: 23, x: 1.0, y: 0.5, size: nodeRadius, color: 'black' },

  { id: 19, x: 0.0, y: 1.0, size: nodeRadius, color: 'black' },
  { id: 20, x: 0.5, y: 1.0, size: nodeRadius, color: 'black' },
  { id: 21, x: 1.0, y: 1.0, size: nodeRadius, color: 'black' },

  { id: 11, x: 0.15, y: 0.15, size: nodeRadius, color: 'black' },
  { id: 12, x: 0.5, y: 0.15, size: nodeRadius, color: 'black' },
  { id: 13, x: 0.85, y: 0.15, size: nodeRadius, color: 'black' },

  { id: 9, x: 0.15, y: 0.5, size: nodeRadius, color: 'black' },
  { id: 14, x: 0.85, y: 0.5, size: nodeRadius, color: 'black' },

  { id: 10, x: 0.15, y: 0.85, size: nodeRadius, color: 'black' },
  { id: 16, x: 0.5, y: 0.85, size: nodeRadius, color: 'black' },
  { id: 15, x: 0.85, y: 0.85, size: nodeRadius, color: 'black' },

  { id: 1, x: 0.3, y: 0.3, size: nodeRadius, color: 'black' },
  { id: 2, x: 0.5, y: 0.3, size: nodeRadius, color: 'black' },
  { id: 3, x: 0.7, y: 0.3, size: nodeRadius, color: 'black' },

  { id: 4, x: 0.3, y: 0.5, size: nodeRadius, color: 'black' },

  { id: 5, x: 0.7, y: 0.5, size: nodeRadius, color: 'black' },
  { id: 6, x: 0.3, y: 0.7, size: nodeRadius, color: 'black' },
  { id: 7, x: 0.5, y: 0.7, size: nodeRadius, color: 'black' },
  { id: 8, x: 0.7, y: 0.7, size: nodeRadius, color: 'black' },
];

renderBoard(nodes, context, size, margin);
// if (!socket.connected) {
socket.on('connect', () => {
  console.log('conectado', socket.id);
  renderBoard(nodes, context, size, margin);
});

socket.on('update-board', m => {
  // const parsed = JSON.parse(m);
  const parsed = m;

  const message = parsed.board.positions;
  console.log('message', message);
  const board = nodes.map(node => {
    if (message[node.id - 1].status === 'White') {
      node.color = 'red';
      node.size = selectedNodeRadius;
      console.log('alterado', node);
    } else if (message[node.id - 1].status === 'Black') {
      node.color = 'black';
      node.size = selectedNodeRadius;
    } else if (message[node.id - 1].status === 'Void') {
      node.color = 'black';
      node.size = nodeRadius;
    }

    return node;
  });
  renderBoard(board, context, size, margin);
});

socket.on('player-add-piece', () => {
  console.log('received');
  screen.onclick = event => {
    const [clickedX, clickedY] = scaleClick(
      event.clientX,
      event.clientY,
      size,
      screen,
    );

    for (const node of nodes) {
      const x = scalePosition(node.x, size, margin);
      const y = scalePosition(node.y, size, margin);

      if (isOverCircle({ x, y, radius: node.size }, clickedX, clickedY)) {
        node.size = selectedNodeRadius;
        socket.emit(
          'player-add-piece',
          JSON.stringify({ position: node.id, giveUp }),
        );
      }
    }
  };
});

socket.on('player-remove-piece', () => {
  screen.onclick = event => {
    console.log('clicou');
    const [clickedX, clickedY] = scaleClick(
      event.clientX,
      event.clientY,
      size,
      screen,
    );

    for (const node of nodes) {
      const x = scalePosition(node.x, size, margin);
      const y = scalePosition(node.y, size, margin);

      if (isOverCircle({ x, y, radius: node.size }, clickedX, clickedY)) {
        node.size = selectedNodeRadius;
        socket.emit(
          'player-remove-piece',
          JSON.stringify({ position: node.id, giveUp }),
        );
      }
    }
  };
});

socket.on('player-move-piece', () => {
  screen.onclick = event => {
    const [clickedX, clickedY] = scaleClick(
      event.clientX,
      event.clientY,
      size,
      screen,
    );

    const actualNodes = nodes.filter(e => e.size === selectedNodeRadius);

    for (const node of actualNodes) {
      const x = scalePosition(node.x, size, margin);
      const y = scalePosition(node.y, size, margin);

      if (isOverCircle({ x, y, radius: node.size }, clickedX, clickedY)) {
        node.size = selectedNodeRadius;
        console.log('Clicou no nó', node.id, '', x, y);
        socket.emit(
          'player-move-piece',
          JSON.stringify({ position: node.id, giveUp }),
        );
        socket.off('player-move-piece');
        socket.on('player-move-piece', () => {
          screen.onclick = event => {
            const [clickedX, clickedY] = scaleClick(
              event.clientX,
              event.clientY,
              size,
              screen,
            );

            for (const node of nodes) {
              const x = scalePosition(node.x, size, margin);
              const y = scalePosition(node.y, size, margin);

              if (
                isOverCircle({ x, y, radius: node.size }, clickedX, clickedY)
              ) {
                node.size = selectedNodeRadius;
                socket.emit(
                  'player-move-piece',
                  JSON.stringify({ position: node.id, giveUp }),
                );
              }
            }
          };
        });
      }
    }
  };
});

socket.on('chat', function (message) {
  console.log('recebeu evento de chat', message);
  const label = document.getElementById('chat-label');
  const chat = message;
  label.innerHTML = '';
  for (let message of chat) {
    label.innerHTML += `${message.nome} diz: ${message.message} <br/> `;
  }
});

const input = document.getElementById('chat-input');

input.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    socket.emit(
      'chat',
      JSON.stringify({ nome: socket.id, message: input.value }),
    );
    console.log('Enviando evento');
    input.value = '';
  }
});

// const botaoDesistencia = document.getElementById('quit');
// botaoDesistencia.onclick = () => {
//   giveUp = true;
// };
