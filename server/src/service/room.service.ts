import {Server, Socket} from 'socket.io';

export const joinRoom = async (io: Server, socket: Socket, roomId: string) => {
  if (await !io.sockets.adapter.rooms.get(roomId)) {
    socket.emit('room-join-error', {message: 'Room is not exists'});
    return;
  }
  if (!(io.sockets.adapter.rooms.get(roomId)!.size >= 2)) {
    await socket.join(roomId);
    await socket.join(`${roomId}-ready`);
    socket.emit('room-join-success');
    socket.to(roomId).emit('has-people-join-room');
  } else {
    socket.emit('room-join-error', {message: 'Room is full'});
  }
  console.log(io.sockets.adapter.rooms.get(roomId));
};

export const createRoom = async (io: Server, socket: Socket) => {
  try {
    let roomId = 95623135;
    while (await io.sockets.adapter.rooms.get(roomId.toString())) {
      roomId = Math.ceil(10000000000 * Math.random());
    }
    await socket.join(roomId.toString());
    await socket.join(`${roomId.toString()}-ready`);
    socket.emit('room-create-success', {
      roomId: roomId.toString(),
    });
  } catch (err) {
    socket.emit('room-create-error', {error: err});
  }
};

export const leaveRoom = async (socket: Socket, roomId: string) => {
  socket.to(roomId).emit('people-leave-room');
  await socket.leave(roomId);
};
