import { calculateWinner } from "./calculateWinner";

export const calculateGameOver = (squares: string[]) => {
  return calculateWinner(squares) || squares.every((square) => square !== null);
};
