'useClient';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  setRoomId as reduxSetRoomId,
  setHasReval,
  setInRoom,
} from '../redux/game.slice';
import {AppDispatch} from '../redux/store';
import gameService from '../services/game.service';
import socketService from '../services/socket.Service';

type Props = {};

const JoinGame = (props: Props) => {
  const [roomId, setRoomId] = useState('');
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;
    if (!roomId || roomId.trim() === '' || !socket) return;

    setLoading(true);

    const joined = await gameService
      .joinGameRoom(socket, roomId)
      .catch((message) => {
        alert(message);
      });

    if (joined) {
      dispatch(setInRoom(true));
      dispatch(reduxSetRoomId(roomId));
      dispatch(setHasReval(true));
    }

    setLoading(false);
  };

  const createRoom = async () => {
    const socket = socketService.socket;

    if (!socket) return;

    setLoading(true);

    const roomId = await gameService.createGameRoom(socket).catch((error) => {
      alert(error);
    });

    if (roomId) {
      dispatch(setInRoom(true));
      dispatch(reduxSetRoomId(roomId));
    }

    setLoading(false);
  };

  return (
    <form onSubmit={joinRoom}>
      <div className='max-w-md mx-auto h-screen flex items-center flex-col justify-center'>
        <h1 className='mb-5 text-4xl'>Caro Game</h1>
        <input
          type='number'
          id='roomId'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4'
          placeholder='Room id'
          required
          value={Number(roomId)}
          onChange={(e) => {
            setRoomId(e.target.value.toString());
          }}
        />

        <div className='flex gap-4'>
          <button
            type='submit'
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            Create room
          </button>
        </div>
      </div>
    </form>
  );
};

export default JoinGame;
