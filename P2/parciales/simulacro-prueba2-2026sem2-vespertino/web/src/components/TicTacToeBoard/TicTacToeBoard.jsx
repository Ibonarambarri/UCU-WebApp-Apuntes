import styles from './TicTacToeBoard.module.css';

export default function TicTacToeBoard({ state, onPlay }) {
  return (
    <div className={styles.grid}>
      {[...state].map((cell, index) => {
        const isEmptyCell = cell === '.';
        return (
          <button
            key={index}
            type="button"
            className={styles.cell}
            onClick={() => onPlay?.(index)}
            disabled={!isEmptyCell || !onPlay}
          >
            {isEmptyCell ? '' : cell}
          </button>
        );
      })}
    </div>
  );
}
