import {instrument} from '@socket.io/admin-ui';
import express, {Application, NextFunction, Request, Response} from 'express';
import helmet from 'helmet';
import {createServer} from 'http';
import createHttpError from 'http-errors';
import httpStatus from 'http-status';
import morgan from 'morgan';
import {Server} from 'socket.io';
import errorMiddleware from './middlewares/error.middleware';
import {ready, unReady, updateGame, winGame} from './service/game.service';
import {createRoom, joinRoom, leaveRoom} from './service/room.service';

const app: Application = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.ACCEPTED).json('Hi!');
});

//error middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(httpStatus.NOT_FOUND, 'Not found!'));
});

app.use(errorMiddleware);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('join-room', ({roomId}) => {
    joinRoom(io, socket, roomId);
  });

  socket.on('create-room', () => {
    createRoom(io, socket);
  });

  socket.on('leave-room', ({roomId}) => {
    leaveRoom(socket, roomId);
  });

  socket.on('ready', ({roomId}) => {
    ready(io, socket, roomId);
  });

  socket.on('un-ready', ({roomId}) => {
    unReady(io, socket, roomId);
  });

  socket.on('update-game', ({roomId, newMatrix, revalWin}) => {
    updateGame(socket, roomId, newMatrix, revalWin);
  });

  socket.on('win-game', ({roomId}) => {
    winGame(socket, roomId);
  });
});

instrument(io, {
  auth: false,
});

httpServer.listen(5050, () => {
  console.log(`Server is running at http://localhost:${5050}`);
});
