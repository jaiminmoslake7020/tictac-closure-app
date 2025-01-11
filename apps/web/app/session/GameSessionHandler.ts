import { getUser } from './UserSessionHandler';
import { getSession, setSession } from './SessionHandler';

const GameIdSessionHandler = () => {
  const getGameId = () => {
    if (getUser()) {
      return getSession().gameId;
    }
  };

  const setGameId = (gameId: string) => {
    if (getUser()) {
      setSession({
        ...getSession(),
        gameId,
      });
    }
  };

  const removeGameId = () => {
    if (getUser()) {
      setSession({
        ...getSession(),
        gameId: undefined,
      });
    }
  };

  return {
    getGameId,
    setGameId,
    removeGameId,
  };
};

const { getGameId, setGameId, removeGameId } = GameIdSessionHandler();

export { getGameId, setGameId, removeGameId };
