import {IMatrix} from '../components/GameScreen';

type checkFunc = (
  matrixGame: IMatrix,
  x: number,
  y: number,
  player: 'x' | 'o'
) => number;

const getHorizontal: checkFunc = (matrixGame, x, y, player) => {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (y + i < matrixGame[0].length && matrixGame[x][y + i] === player) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      y - i >= 0 &&
      y - i < matrixGame[0].length &&
      matrixGame[x][y - i] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
};

const getVertical: checkFunc = (matrixGame, x, y, player) => {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (x + i < matrixGame.length && matrixGame[x + i][y] === player) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < matrixGame.length &&
      matrixGame[x - i][y] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
};

const getRightDiagonal: checkFunc = (matrixGame, x, y, player) => {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < matrixGame.length &&
      y + i < matrixGame[0].length &&
      matrixGame[x - i][y + i] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      x + i < matrixGame.length &&
      y - i >= 0 &&
      y - i < matrixGame[0].length &&
      matrixGame[x + i][y - i] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
};

const getLeftDiagonal: checkFunc = (matrixGame, x, y, player) => {
  let count = 1;
  for (let i = 1; i < 5; i++) {
    if (
      x - i >= 0 &&
      x - i < matrixGame.length &&
      y - i >= 0 &&
      y - i < matrixGame[0].length &&
      matrixGame[x - i][y - i] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  for (let i = 1; i < 5; i++) {
    if (
      x + i < matrixGame.length &&
      y + i < matrixGame[0].length &&
      matrixGame[x + i][y + i] === player
    ) {
      count++;
    } else {
      break;
    }
  }

  return count;
};

const checkWin = (matrixGame: IMatrix, points: {x: number; y: number}) => {
  const playerSymbol = matrixGame[points.x][points.y];
  if (!playerSymbol) return false;
  return (
    getHorizontal(matrixGame, points.x, points.y, playerSymbol) >= 5 ||
    getVertical(matrixGame, points.x, points.y, playerSymbol) >= 5 ||
    getLeftDiagonal(matrixGame, points.x, points.y, playerSymbol) >= 5 ||
    getRightDiagonal(matrixGame, points.x, points.y, playerSymbol) >= 5
  );
};

export default checkWin;
