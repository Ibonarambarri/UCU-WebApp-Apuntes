import { useCallback, useState } from 'react';
import { useFetchPlayers } from '../../hooks/useFetchPlayers.js';
import { useCreateMatch } from '../../hooks/useCreateMatch.js';
import TicTacToeGame from '../../components/TicTacToeGame/TicTacToeGame.jsx';
import PlayersSelection from '../../components/PlayersSelection/PlayersSelection.jsx';
import Header from '../../components/Header/Header.jsx';
import Button from '../../components/Button/Button.jsx';
import LinkButton from '../../components/Button/LinkButton.jsx';
import styles from './PagePlay.module.css';

export default function PagePlay() {
  const { data: players, error } = useFetchPlayers();
  // null = pantalla de selección; { playerXId, playerOId } = partida en curso.
  // Todo el "flujo" de la página se deriva de este estado (nada de navigate state).
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const { isCreating, createMatch } = useCreateMatch();

  // useCallback: el juego recibe onFinish como dependencia de un efecto,
  // así que conviene que su identidad sea estable.
  const handleFinish = useCallback(({ history, winner }) => {
    setIsGameFinished(true);
    // La partida se guarda recién al terminar, con el history completo.
    createMatch({ playerX: selectedPlayers.playerXId, playerO: selectedPlayers.playerOId, history, winner })
      .catch((err) => setSaveError(err));
  }, [createMatch, selectedPlayers]);

  const handleStart = (players) => {
    setSelectedPlayers(players);
    setIsGameFinished(false);
    setSaveError(null);
  };

  // "Play again": volver a la selección reseteando estado de React.
  // Al desmontarse <TicTacToeGame>, su useTicTacToe se descarta y la próxima
  // partida arranca con tablero vacío. Sin window.location.reload().
  const handlePlayAgain = () => {
    setSelectedPlayers(null);
    setIsGameFinished(false);
    setSaveError(null);
  };

  let content;
  if (error) {
    content = <p className={styles.message}>Failed to load players.</p>;
  } else if (!players) {
    content = <p className={styles.message}>Loading…</p>;
  } else if (selectedPlayers) {
    const playerX = players.find((player) => player.id === selectedPlayers.playerXId);
    const playerO = players.find((player) => player.id === selectedPlayers.playerOId);
    content = (
      <>
        <TicTacToeGame playerX={playerX} playerO={playerO} onFinish={handleFinish} />
        {isGameFinished && (
          <div className={styles.after}>
            {saveError && <p className={styles.error}>Saving match failed! {saveError.message}</p>}
            {isCreating ? (
              <p className={styles.message}>Saving match…</p>
            ) : (
              <Button variant="primary" onClick={handlePlayAgain}>Play again</Button>
            )}
          </div>
        )}
      </>
    );
  } else {
    content = <PlayersSelection players={players} onStart={handleStart} />;
  }

  return (
    <div className={styles.page}>
      <Header subtitle="Play" />
      {content}
      {/* Fuera del if/else: el botón al inicio se ve en todo momento. */}
      <footer className={styles.footer}>
        <LinkButton to="/">Main menu</LinkButton>
      </footer>
    </div>
  );
}
