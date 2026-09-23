import { useState } from 'react';
import Button from '../Button/Button.jsx';
import styles from './PlayersSelection.module.css';

export default function PlayersSelection({ players, onStart }) {
  // Selects controlados: el valor vive en el estado, no en el DOM.
  const [playerXId, setPlayerXId] = useState('');
  const [playerOId, setPlayerOId] = useState('');

  // No se puede jugar sin elegir a los dos, ni contra uno mismo.
  const canStart = playerXId && playerOId && playerXId !== playerOId;

  const handleSubmit = (event) => {
    event.preventDefault(); // un form recarga la página por defecto
    if (canStart) {
      onStart({ playerXId, playerOId });
    }
  };

  return (
    <form className={styles.selection} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Player X:</span>
          <select value={playerXId} onChange={(event) => setPlayerXId(event.target.value)}>
            <option value="">Select…</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Player O:</span>
          <select value={playerOId} onChange={(event) => setPlayerOId(event.target.value)}>
            <option value="">Select…</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
        </label>
      </div>
      <Button type="submit" variant="primary" disabled={!canStart}>Play</Button>
    </form>
  );
}
