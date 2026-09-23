import { useCallback, useState } from 'react';
import { useFetchPlayers } from '../../hooks/useFetchPlayers.js';
import { useCreateMatch } from '../../hooks/useCreateMatch.js';
import TicTacToeGame from '../../components/TicTacToeGame/TicTacToeGame.jsx';
import PlayersSelection from '../../components/PlayersSelection/PlayersSelection.jsx';
import Header from '../../components/Header/Header.jsx';

export default function PagePlay() {
  const { data: players, error } = useFetchPlayers();
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const { isCreating, createMatch } = useCreateMatch();

  const handleFinish = useCallback(({ history, winner }) => {
    setIsGameFinished(true);
    createMatch({ playerX: selectedPlayers.playerXId, playerO: selectedPlayers.playerOId, history, winner })
      .catch((error) => {
        alert(`Saving match failed! ${error.message}`);
      });
  }, [createMatch, selectedPlayers]);

  let content;
  if (error) {
    content = <p>Failed to load players.</p>;
  } else if (!players) {
    content = <p>Loading…</p>;
  } else if (selectedPlayers) {
    const playerX = players.find((player) => player.id === selectedPlayers.playerXId);
    const playerO = players.find((player) => player.id === selectedPlayers.playerOId);
    content = (
      <>
        <TicTacToeGame playerX={playerX} playerO={playerO} onFinish={handleFinish} />
        {isGameFinished && (
          isCreating ? (
            <p>Saving match…</p>
          ) : (
            <button type="button" onClick={() => window.location.reload()}>
              Play new game
            </button>
          )
        )}
      </>
    );
  } else {
    content = <PlayersSelection players={players} onStart={setSelectedPlayers} />;
  }

  return (
    <div>
      <Header title="Tic-Tac-Toe" />
      {content}
    </div>
  );
}
