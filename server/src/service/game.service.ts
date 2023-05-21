import {Server, Socket} from 'socket.io';

export const ready = async (io: Server, socket: Socket, roomId: string) => {
  if (await !io.sockets.adapter.rooms.get(roomId)) return;
  if ((await io.sockets.adapter.rooms.get(roomId)!.size) < 2) return;
  if (await !io.sockets.adapter.rooms.get(`${roomId}-ready`)!.size) return;

  await socket.leave(`${roomId}-ready`);

  const checkAllIsReady = await !io.sockets.adapter.rooms.get(`${roomId}-ready`)
    ?.size;

  if (checkAllIsReady) {
    const firstTurn = Math.floor(Math.random() * 2) + 1;
    if (firstTurn === 1) {
      socket.emit('start-game', {isYourTurn: true, symbol: 'x'});
      socket.to(roomId).emit('start-game', {isYourTurn: false, symbol: 'o'});
    } else {
      socket.emit('start-game', {isYourTurn: false, symbol: 'o'});
      socket.to(roomId).emit('start-game', {isYourTurn: true, symbol: 'x'});
    }
  }
};

export const unReady = async (io: Server, socket: Socket, roomId: string) => {
  await socket.join(`${roomId}-ready`);
};

export const updateGame = (
  socket: Socket,
  roomId: string,
  newMatrix: any,
  revalWin: boolean
) => {
  socket.to(roomId).emit('on-game-update', {newMatrix, revalWin});
};

export const winGame = (socket: Socket, roomId: string) => {
  socket.to(roomId).emit('reval-win');
};
