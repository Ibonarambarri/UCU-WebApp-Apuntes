import { useEffect } from 'react';
import { useTicTacToe } from '../../hooks/useTicTacToe.js';
import TicTacToeBoard from '../TicTacToeBoard/TicTacToeBoard.jsx';
import styles from './TicTacToeGame.module.css';

export default function TicTacToeGame({ playerX, playerO, onFinish }) {
  const { activePlayer, history, isFinished, moves, play, state, winner } = useTicTacToe();

  useEffect(() => {
    if (isFinished) {
      onFinish({ history, winner });
    }
  }, [isFinished, winner, history, onFinish]);

  const activePlayerName = activePlayer === 'X' ? playerX.name : activePlayer === 'O' ? playerO.name : null;

  let status;
  if (isFinished) {
    if (winner === 'X') {
      status = `${playerX.name} (X) wins!`;
    } else if (winner === 'O') {
      status = `${playerO.name} (O) wins!`;
    } else {
      status = `It's a draw!`;
    }
  } else {
    status = `${activePlayerName}'s turn (${activePlayer})`;
  }

  return (
    <div className={styles.board}>
      <p className={styles.status}>{status}</p>
      <TicTacToeBoard state={state} moves={moves} onPlay={play} />
    </div>
  );
}
