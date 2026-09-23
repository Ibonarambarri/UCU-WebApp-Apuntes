import { useState } from 'react';

const EMPTY_BOARD = '.........';
const LINES_X = /^(X{3}.{6}|.{3}X{3}.{3}|.{6}X{3}|(X..){3}|(.X.){3}|(..X){3}|X...X...X|..X.X.X..)$/;
const LINES_O = /^(O{3}.{6}|.{3}O{3}.{3}|.{6}O{3}|(O..){3}|(.O.){3}|(..O){3}|O...O...O|..O.O.O..)$/;

export function useTicTacToe(initialHistory = undefined) {
  const [history, setHistory] = useState(initialHistory ?? [EMPTY_BOARD]);
  const state = history[history.length - 1];
  const stateArray = [...state];

  const wonX = LINES_X.test(state);
  const wonO = LINES_O.test(state);
  const countX = stateArray.filter((s) => s === 'X').length;
  const countO = stateArray.filter((s) => s === 'O').length;
  const emptySquareIndices = stateArray.map((s, i) => s === '.' ? i : -1).filter((i) => i >= 0);

  const isFinished = wonX || wonO || emptySquareIndices.length === 0;
  const winner = wonX ? 'X' : wonO ? 'O' : null;
  const activePlayer = isFinished ? null : countX > countO ? 'O' : 'X';
  const moves = isFinished ? [] : emptySquareIndices;

  const play = (move) => {
    if (!moves.includes(move)) {
      throw new Error(`Invalid move ${move} for ${state}!`);
    }
    const newState = `${state.slice(0, move)}${activePlayer}${state.slice(move + 1)}`;
    setHistory((prevHistory) => [...prevHistory, newState]);
  };
  const reset = (state = undefined) => {
    const newState = state ?? EMPTY_BOARD;
    setHistory([newState]);
  };

  return {
    activePlayer, history, isFinished, moves, play, reset, winner, state,
  };
}
