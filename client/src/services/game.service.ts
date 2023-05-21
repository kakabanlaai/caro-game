import {Socket} from 'socket.io-client';
import {IMatrix, IStartState} from '../components/GameScreen';

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit('join-room', {roomId});
      socket.on('room-join-success', () => rs(true));
      socket.on('room-join-error', ({message}) => rj(message));
    });
  }

  public async createGameRoom(socket: Socket): Promise<string> {
    return new Promise((rs, rj) => {
      socket.emit('create-room');
      socket.on('room-create-success', ({roomId}) => rs(roomId));
      socket.on('room-create-error', ({error}) => rj(error));
    });
  }

  public async leaveRoom(socket: Socket, roomId: string) {
    return new Promise((rs, rj) => {
      socket.emit('leave-room', {roomId});
    });
  }

  public async ready(socket: Socket, roomId: string) {
    socket.emit('ready', {roomId});
  }

  public async unReady(socket: Socket, roomId: string) {
    socket.emit('un-ready', {roomId});
  }

  public async updateGame(
    socket: Socket,
    payload: {roomId: string; newMatrix: IMatrix; revalWin: boolean}
  ) {
    socket.emit('update-game', payload);
  }

  public async onGameUpdate(
    socket: Socket,
    listener: (newMatrix: IMatrix, revalWin: boolean) => void
  ) {
    socket.on('on-game-update', ({newMatrix, revalWin}) =>
      listener(newMatrix, revalWin)
    );
  }

  public async onStartGame(
    socket: Socket,
    listener: (options: IStartState) => void
  ) {
    socket.on('start-game', listener);
  }

  public async onRevalJoinRoom(socket: Socket, listener: () => void) {
    socket.on('has-people-join-room', listener);
  }

  public async onRevalLeaveRoom(socket: Socket, listener: () => void) {
    socket.on('people-leave-room', () => {
      listener();
    });
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit('game_win', {message});
  }

  public async onRevalWin(socket: Socket, listener: () => void) {
    socket.on('reval-win', () => {
      listener();
    });
  }

  //   public async onGameWin(socket: Socket, listener: (message: string) => void) {
  //     socket.on('on_game_win', ({message}) => listener(message));
  //   }
}

const gameService = new GameService();

export default gameService;
