'use client';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import GameScreen from '../components/GameScreen';
import JoinGame from '../components/JoinGame';
import {RootState} from '../redux/store';
import socketService from '../services/socket.Service';

export default function Home() {
  const isInRoom = useSelector((state: RootState) => state.game.isInRoom);

  const connectSocket = async () => {
    const socket = await socketService
      .connect('http://localhost:5050')
      .catch((err) => {
        console.log('Error: ', err);
      });
  };

  useEffect(() => {
    connectSocket();

    return () => {
      socketService.socket?.disconnect();
    };
  }, []);

  return (
    <div>
      {!isInRoom && <JoinGame />}
      {isInRoom && <GameScreen />}
    </div>
  );
}
