import { useState } from 'react';
import { useFetchPlayers } from '../../hooks/useFetchPlayers.js';
import { useFetchMatches } from '../../hooks/useFetchMatches.js';
import { useCreatePlayer } from '../../hooks/useCreatePlayer.js';
import Header from '../../components/Header/Header.jsx';
import Button from '../../components/Button/Button.jsx';
import LinkButton from '../../components/Button/LinkButton.jsx';
import styles from './PagePlayers.module.css';

// Función pura fuera del componente: no depende de estado, solo de sus argumentos.
// Jugados = partidas donde participa (como X o como O).
// Ganados = partidas donde el ganador es la marca con la que jugó.
function getStats(playerId, matches) {
  const played = matches.filter(
    (match) => match.playerX === playerId || match.playerO === playerId,
  );
  const won = played.filter(
    (match) => (match.winner === 'X' && match.playerX === playerId)
      || (match.winner === 'O' && match.playerO === playerId),
  );
  return { played: played.length, won: won.length };
}

export default function PagePlayers() {
  const {
    data: players, error: playersError, refetch: refetchPlayers,
  } = useFetchPlayers();
  const { data: matches, error: matchesError } = useFetchMatches();
  const { isCreating, createPlayer } = useCreatePlayer();

  // Input controlado + error del alta.
  const [name, setName] = useState('');
  const [createError, setCreateError] = useState(null);

  const trimmedName = name.trim();

  const handleSubmit = async (event) => {
    event.preventDefault(); // evita que el form recargue la página
    if (!trimmedName || isCreating) {
      return;
    }
    try {
      await createPlayer({ name: trimmedName });
      setName('');
      setCreateError(null);
      // La lista no se entera sola del PUT: hay que volver a pedirla.
      refetchPlayers();
    } catch (err) {
      setCreateError(err);
    }
  };

  let list;
  if (playersError || matchesError) {
    list = <p className={styles.error}>Failed to load players.</p>;
  } else if (!players || !matches) {
    // Chequeamos !data (y no isLoading) para que en un refetch se siga
    // viendo la lista anterior en vez de parpadear "Loading…".
    list = <p>Loading…</p>;
  } else {
    list = (
      <ul className={styles.list}>
        {players.map((player) => {
          const { won, played } = getStats(player.id, matches);
          return (
            <li key={player.id}>
              {player.name} - {won} / {played}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className={styles.page}>
      <Header subtitle="Players" />
      {list}

      <footer className={styles.footer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="new-player">New:</label>
          <input
            id="new-player"
            className={styles.input}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isCreating}
          />
          <Button type="submit" variant="primary" disabled={!trimmedName || isCreating}>
            {isCreating ? 'Adding…' : 'Add'}
          </Button>
        </form>
        {createError && <p className={styles.error}>Adding player failed! {createError.message}</p>}
        <LinkButton to="/">Main menu</LinkButton>
      </footer>
    </div>
  );
}
