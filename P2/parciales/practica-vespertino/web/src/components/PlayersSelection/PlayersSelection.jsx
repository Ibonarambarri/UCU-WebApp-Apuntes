import { useState } from 'react';
import styles from './PlayersSelection.module.css';

export default function PlayersSelection({ players, onStart }) {
  const [playerXId, setPlayerXId] = useState('');
  const [playerOId, setPlayerOId] = useState('');

  const canStart = playerXId && playerOId && playerXId !== playerOId;

  return (
    <div className={styles.selection}>
      <label className={styles.field}>
        Player X
        <select value={playerXId} onChange={(event) => setPlayerXId(event.target.value)}>
          <option value="">Select a player…</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>{player.name}</option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        Player O
        <select value={playerOId} onChange={(event) => setPlayerOId(event.target.value)}>
          <option value="">Select a player…</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>{player.name}</option>
          ))}
        </select>
      </label>
      <button type="button" disabled={!canStart} onClick={() => onStart({ playerXId, playerOId })}>
        Start game
      </button>
    </div>
  );
}
