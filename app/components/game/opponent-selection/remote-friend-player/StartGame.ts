import {FirebaseGameType, RoomReadyResponseType, UserType} from '@types-dir/index';
import {
  getRandomMove,
  InitializeContextsFunctionType,
  useContextCurrentMove, useContextGameId, useContextGamePlayerType,
  useContextUserSession,
  UseCurrentMoveHookType,
} from '@contexts/index';
import {createGame, onGameCreated} from '@firebase-dir/game';
import {addToRoot, createEL} from '@utils/index';
import {Layout} from '@components/layouts/layout/Layout';
import {Loader} from '@components/base';
import {GameActionCallbacksType, GameActions, GameActionsType} from '@components/game/GameActions';

export const StartGame = (contextsData:InitializeContextsFunctionType, gameActions:GameActionCallbacksType, onLevelSelected: () => void) => {

  const { setCurrentMove } = useContextCurrentMove(contextsData) as UseCurrentMoveHookType;
  const {
    getUser
  } = useContextUserSession(contextsData);
  const {
    setGameId, getGameId, hasGameId, removeGameId
  } = useContextGameId(contextsData);

  const {
    setPlayerType
  } = useContextGamePlayerType( contextsData );

  const {
    showLoader, stopLoader
  } = Loader();

  const startProcessJoiner = async (v:RoomReadyResponseType) => {
    const {
      roomCode
    } = v;
    const userItem = getUser() as UserType;
    const currentMove = getRandomMove(contextsData);
    const g = await createGame(roomCode, currentMove, userItem.id);
    if (g) {
      console.log('GAME CREATED BY ME', g.id);
      setGameId(g.id);
      setCurrentMove(currentMove);
      onLevelSelected();
    } else {
      // TODO: Show error message
      console.log('Error creating game by me');
    }
  }

  const startProcessCreator = (v:RoomReadyResponseType) => {
    const {
      roomCode
    } = v;
    let oneTimeExecution = false;

    const gA = GameActions(contextsData, gameActions) as GameActionsType;
    const div = createEL('div');
    addToRoot(Layout( div as HTMLElement, gA));
    showLoader();

    // console.log("onGameCreated");
    onGameCreated(roomCode, async (d: FirebaseGameType, gameId: string) => {
      // console.log('onGameCreated Inside Fane ', d, gameId);
      if (
        !hasGameId() &&
        oneTimeExecution === false
      ) {
        console.log('Game started Game 1', gameId);
        oneTimeExecution = true;
        setGameId(gameId);
        setCurrentMove(d.currentMove);
        stopLoader();
        onLevelSelected();
      } else {
        console.log('GAME ALREADY STARTED onGameCreated', getGameId(), hasGameId(), oneTimeExecution);
      }
    }, () => {
      console.log('onGameCreated Finished');
    });

  }

  const startProcess = async (v:RoomReadyResponseType) => {
    if (v.playerType === 'joiner') {
      await startProcessJoiner(v);
    } else {
      startProcessCreator(v);
    }
  }

}
