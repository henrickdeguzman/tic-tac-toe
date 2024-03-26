"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

import Square from "./(private)/components/Square";
import { calculateWinner } from "./(private)/utils/calculateWinner";
import { calculateGameOver } from "./(private)/utils/calculateGameOver";
import {
  chooseAction,
  chooseRandom,
  logQTable,
  updateQTable,
} from "./(private)/utils/qlearning";

export default function Home() {
  const [isXNext, setIsXNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  let i = 0;

  const handleNextState = useCallback(
    (value: number) => {
      const tempSquare = squares.slice();
      if (isXNext) {
        tempSquare[value] = "X";
      } else {
        tempSquare[value] = "O";
      }
      return tempSquare;
    },
    [isXNext, squares]
  );

  const handleClick = useCallback(
    (value: number) => {
      if (calculateWinner(squares) || squares[value]) {
        return;
      }

      setSquares(handleNextState(value));
      setIsXNext(!isXNext);
    },
    [handleNextState, isXNext, squares]
  );

  const status = useMemo(() => {
    const gameOver = calculateGameOver(squares);
    const winner = calculateWinner(squares);

    if (gameOver && !winner) return "Game Over";

    return winner ? `Winner: ${winner}` : `Next player: ${isXNext ? "X" : "O"}`;
  }, [squares, isXNext]);

  const handleReset = () => {
    setIsXNext(true);
    setSquares(Array(9).fill(null));
  };

  useEffect(() => {
    const gameOver = calculateGameOver(squares);
    const winner = calculateWinner(squares);
    const moves = squares.filter((square) => square === "O").length;
    let reward = gameOver ? 5 : 10 - moves * 2;
    if (winner !== null) {
      reward += winner === "O" ? 15 : -30;
    }

    // AI is O
    if (!isXNext) {
      const choosenAction = chooseAction(squares.toString());
      updateQTable(
        squares.toString(),
        choosenAction,
        reward,
        handleNextState(choosenAction).toString()
      );

      handleClick(choosenAction);
    }

    // This is for training the AI
    const shouldTrain = false;
    if (shouldTrain) {
      if (i % 1000000 === 0) {
        logQTable();
      }
      if (isXNext) {
        const choosenRandom = chooseRandom(squares.toString());
        updateQTable(
          squares.toString(),
          choosenRandom,
          reward,
          handleNextState(choosenRandom).toString()
        );
        handleClick(choosenRandom);
      }
      if (calculateGameOver(squares)) {
        handleReset();
      }
      i++;
    }
  }, [handleClick, handleNextState, i, isXNext, squares]);

  return (
    <div className="p-8">
      <h1>{status}</h1>
      <div className="board-row">
        <Square value={squares[0]} onClick={() => handleClick(0)} />
        <Square value={squares[1]} onClick={() => handleClick(1)} />
        <Square value={squares[2]} onClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onClick={() => handleClick(3)} />
        <Square value={squares[4]} onClick={() => handleClick(4)} />
        <Square value={squares[5]} onClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onClick={() => handleClick(6)} />
        <Square value={squares[7]} onClick={() => handleClick(7)} />
        <Square value={squares[8]} onClick={() => handleClick(8)} />
      </div>
      <button onClick={handleReset}>Rest</button>
    </div>
  );
}
