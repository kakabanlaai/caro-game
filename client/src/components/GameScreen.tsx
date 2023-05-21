'useClient';

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  resetDefaultValue,
  setGameStarted,
  setHasReval,
  setInRoom,
  setPlayerSymbol,
  setPlayerTurn,
  setRoomId,
} from '../redux/game.slice';
import {RootState} from '../redux/store';
import gameService from '../services/game.service';
import socketService from '../services/socket.Service';
import checkWin from '../utils/checkWinGame';

export type IStartState = {
  isYourTurn: boolean;
  symbol: 'x' | 'o';
};
export type IMatrix = Array<Array<null | 'x' | 'o'>>;
const defaultMatrix: IMatrix = Array(19)
  .fill(null)
  .map(() => Array(19).fill(null));

const GameScreen = () => {
  const [isReady, setReady] = useState(false);
  const [isEndGame, setEndGame] = useState(false);
  const [youScore, setYouScore] = useState(0);
  const [revalScore, setRevalScore] = useState(0);
  const roomId = useSelector((state: RootState) => state.game.roomId);
  const isPlayerTurn = useSelector(
    (state: RootState) => state.game.isPlayerTurn
  );
  const isGameStarted = useSelector(
    (state: RootState) => state.game.isGameStarted
  );
  const playerSymbol = useSelector(
    (state: RootState) => state.game.playerSymbol
  );
  const hasReval = useSelector((state: RootState) => state.game.hasReval);

  const socket = socketService.socket;
  const dispatch = useDispatch();

  const [matrix, setMatrix] = useState<IMatrix>(defaultMatrix);

  const updateGame = (x: number, y: number) => {
    if (!isGameStarted || isEndGame || !isPlayerTurn || !!matrix[x][y]) return;

    const newMatrix = [...matrix];
    newMatrix[x][y] = playerSymbol;
    console.log(newMatrix);
    setMatrix(newMatrix);

    if (socketService.socket) {
      const check = checkWin(newMatrix, {x, y});
      gameService.updateGame(socketService.socket, {
        roomId,
        newMatrix,
        revalWin: check,
      });

      if (check) {
        setEndGame(true);
        alert('You Won!');
        setYouScore((prev) => prev + 1);
      }
      dispatch(setPlayerTurn(false));
    }
  };

  const handleGameUpdate = () => {
    console.log(playerSymbol);
    if (socketService.socket)
      gameService.onGameUpdate(
        socketService.socket,
        (newMatrix: IMatrix, revalWin: boolean) => {
          setMatrix(newMatrix);
          if (revalWin) {
            alert('You lose!');
            setRevalScore((prev) => prev + 1);
            setEndGame(true);
          }
          dispatch(setPlayerTurn(true));
        }
      );
  };

  const handleGameStart = () => {
    if (socketService.socket)
      gameService.onStartGame(socketService.socket, (options) => {
        dispatch(setGameStarted(true));
        dispatch(setPlayerTurn(options.isYourTurn));
        dispatch(setPlayerSymbol(options.symbol));
      });
  };

  const handleRevalJoinRoom = () => {
    if (socketService.socket)
      gameService.onRevalJoinRoom(socketService.socket, () => {
        dispatch(setHasReval(true));
      });
  };

  const handleRevalLeaveRoom = () => {
    if (socketService.socket)
      gameService.onRevalLeaveRoom(socketService.socket, () => {
        setNewGame();
        if (!socketService.socket) return;
        gameService.unReady(socketService.socket, roomId);
      });
  };

  const handleReady = () => {
    if (!socketService.socket) return;
    if (isReady) {
      gameService.unReady(socketService.socket, roomId);
    } else {
      gameService.ready(socketService.socket, roomId);
    }

    setReady((prev) => !prev);
  };

  const handleLeaveRoom = async () => {
    dispatch(setInRoom(false));
    dispatch(setRoomId(''));
    setNewGame();
    if (!socket) return;
    await gameService.leaveRoom(socket, roomId);
  };

  const setNewGame = () => {
    setEndGame(false);
    dispatch(setHasReval(false));
    dispatch(setGameStarted(false));
    dispatch(setPlayerTurn(false));
    dispatch(setPlayerSymbol('x'));
    setReady(false);
    setMatrix(
      Array(19)
        .fill(null)
        .map(() => Array(19).fill(null))
    );
  };

  useEffect(() => {
    handleGameStart();
    handleGameUpdate();
    handleRevalJoinRoom();
    handleRevalLeaveRoom();

    return () => {
      dispatch(resetDefaultValue());
    };
  }, []);

  return (
    <div className='w-screen h-screen'>
      <div className=' relative flex justify-center my-4 gap-5 text-4xl'>
        <h1 className={isPlayerTurn ? 'underline' : ''}>You</h1>
        <h1>{youScore}</h1>
        <h1>:</h1>
        <h1>{revalScore}</h1>
        <h1 className={!isPlayerTurn ? 'underline' : ''}>Reval</h1>

        <button
          onClick={handleLeaveRoom}
          className='absolute right-5 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center '
        >
          <Image src='/x-circle.svg' alt='' width={25} height={25} />
        </button>
      </div>
      <div className='flex justify-center'>
        {!isGameStarted && (
          <>
            {!hasReval && <h1>{`Send room id to your friend: ${roomId}`}</h1>}
            {hasReval && (
              <button
                onClick={handleReady}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'
              >
                {isReady ? 'Un Ready' : 'Ready'}
              </button>
            )}
          </>
        )}
        {isGameStarted && (
          <table>
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className=' w-9 h-9 border-solid border-gray-600 border-[1.5px]'
                      onClick={() => {
                        updateGame(r, c);
                      }}
                    >
                      {!cell && isPlayerTurn && !isEndGame && (
                        <span
                          className={
                            'block w-7 h-7 rounded-full mx-auto ' +
                            (playerSymbol === 'x'
                              ? 'hover:bg-blue-600'
                              : 'hover:bg-orange-600')
                          }
                        ></span>
                      )}

                      {cell && (
                        <span
                          className={
                            'block w-7 h-7 rounded-full mx-auto ' +
                            (cell === 'x' ? 'bg-blue-600' : 'bg-orange-600')
                          }
                        ></span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
