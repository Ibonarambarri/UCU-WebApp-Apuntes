import { useEffect, useRef } from 'react';
import { useTicTacToe } from '../../hooks/useTicTacToe.js';
import TicTacToeBoard from '../TicTacToeBoard/TicTacToeBoard.jsx';
import styles from './TicTacToeGame.module.css';

export default function TicTacToeGame({ playerX, playerO, onFinish }) {
  const { activePlayer, history, isFinished, play, state, winner } = useTicTacToe();
  // Marca si ya avisamos del final. Si el padre re-renderiza y onFinish cambia
  // de identidad, el efecto se vuelve a correr: sin esta guarda la partida
  // se guardaría dos veces. Un ref no provoca re-render y dura lo que dura el componente.
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (isFinished && !hasReportedRef.current) {
      hasReportedRef.current = true;
      onFinish({ history, winner });
    }
  }, [isFinished, winner, history, onFinish]);

  const nameOf = (mark) => (mark === 'X' ? playerX.name : playerO.name);

  // Textos del diseño: "Moves X (Adriana)" / "X Wins (Adriana)".
  let status;
  if (!isFinished) {
    status = `Moves ${activePlayer} (${nameOf(activePlayer)})`;
  } else if (winner) {
    status = `${winner} Wins (${nameOf(winner)})`;
  } else {
    status = 'Draw!';
  }

  return (
    <div className={styles.board}>
      <p className={styles.status}>{status}</p>
      {/* Al terminar no pasamos onPlay: el tablero queda deshabilitado. */}
      <TicTacToeBoard state={state} onPlay={isFinished ? undefined : play} />
    </div>
  );
}
