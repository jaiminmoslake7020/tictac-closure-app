import {FirebaseGameType, RoomReadyResponseType, UserType} from '@types-dir/index';
import {
  getGameDocumentPath,
  getRandomMove,
  InitializeContextsFunctionType,
  useContextCurrentMove, useContextGameId, useContextGamePlayerType, useContextRoomCodeId, useContextTurnStorage,
  useContextUserSession,
  UseCurrentMoveHookType,
} from '@contexts/index';
import {createGame, getAllGameMoves, getGame, onGameCreated} from '@firebase-dir/game';
import {addToRoot, createEL} from '@utils/index';
import {Layout} from '@components/layouts/layout/Layout';
import {Loader} from '@components/base';
import {GameActionCallbacksType, GameActions, GameActionsType} from '@components/game/GameActions';
import {
  IsGameAvailableSubscriber
} from '@components/game/opponent-selection/remote-friend-player/IsGameAvailableSubscriber';
import {
  UpdateLastActiveTimeSubscriber
} from '@components/game/opponent-selection/remote-friend-player/UpdateLastActiveTimeSubscriber';
import {AddErrorWithAction} from '@components/base/ux/notification/AddErrorWithAction';
import {turnData} from '@data/index';

export const StartGame = (contextsData:InitializeContextsFunctionType, gameActions:GameActionCallbacksType, onLevelSelected: () => void) => {

  const { setCurrentMove } = useContextCurrentMove(contextsData) as UseCurrentMoveHookType;

  const {
    getUser
  } = useContextUserSession(contextsData);

  const {
    addNewTurn
  } = useContextTurnStorage(contextsData);

  const {
    setGameId, getGameId, hasGameId
  } = useContextGameId(contextsData);

  const {
    getRoomCodeId
  } = useContextRoomCodeId(contextsData);

  const {
    getPlayerType
  } = useContextGamePlayerType( contextsData );

  const {
    showLoader, stopLoader
  } = Loader();

  const addGameAvailableSubscriber = async () => {
    // console.log('addGameAvailableSubscriber');
    const { isGameAvailableSubscriber } = IsGameAvailableSubscriber(contextsData, gameActions);
    await isGameAvailableSubscriber();
  }

  const updateGameSubscriber = async () => {
    // console.log('updateGameSubscriber');
    const { updateGameIsActiveSubscriber } = UpdateLastActiveTimeSubscriber(contextsData, gameActions);
    await updateGameIsActiveSubscriber();
  }

  const createGameForRoomJoiner = async () => {
    // console.log('createGameForRoomJoiner');
    const roomCode = getRoomCodeId();
    const userItem = getUser() as UserType;
    const currentMove = getRandomMove(contextsData);
    const g = await createGame(roomCode, currentMove, userItem.id);
    if (g) {
      // console.log('GAME CREATED BY ME', g.id);
      setGameId(g.id);
      setCurrentMove(currentMove);
      await updateGameSubscriber();
      await addGameAvailableSubscriber();
      onLevelSelected();
    } else {
      // TODO: Show error message
      // console.log('Error creating game by me');
    }
  }

  const joinGameForRoomCreator = () => {
    // console.log('joinGameForRoomCreator');
    const roomCode = getRoomCodeId();
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

        // console.log('Game started Game 1', gameId);
        oneTimeExecution = true;
        setGameId(gameId);
        setCurrentMove(d.currentMove);
        stopLoader();
        await updateGameSubscriber();
        await addGameAvailableSubscriber();
        onLevelSelected();

      } else {
        // console.log('GAME ALREADY STARTED onGameCreated', getGameId(), hasGameId(), oneTimeExecution);
      }
    }, () => {
      // console.log('onGameCreated Finished');
    });

  }

  const startProcess = async () => {
    // console.log('startProcess', getPlayerType());
    if (getPlayerType() === 'joiner') {
      await createGameForRoomJoiner();
    } else {
      joinGameForRoomCreator();
    }
  }

  const joinGame = async () => {
    // console.log('joinGame');
    const { isGameAvailable } = IsGameAvailableSubscriber(contextsData, gameActions);
    const isItAvailable = await isGameAvailable();
    // console.log('isItAvailable', isItAvailable);
    if ( isItAvailable ) {
      await updateGameSubscriber();
      await addGameAvailableSubscriber();

      const gameDocumentPath = getGameDocumentPath(contextsData);
      if (gameDocumentPath) {
        const gameData = await getGame(gameDocumentPath);
        if (gameData) {
          const {
            currentMove
          } = gameData;
          const { setCurrentMove } = useContextCurrentMove(contextsData);
          setCurrentMove(currentMove);
          const moves = await getAllGameMoves(gameDocumentPath);
          if (moves) {
            moves.forEach((v) => {
              const {
                position, userId
              } = v;
              if (userId === getUser().id) {
                addNewTurn(position, turnData.turn);
              } else {
                addNewTurn(position, turnData.anotherTurn);
              }
            });
          }
          onLevelSelected();
        } else {
          AddErrorWithAction('Game is not available at Firebase.', () => {
            const gA = GameActions(contextsData, gameActions) as GameActionsType;
            gA.exitRoom();
          });
        }
      } else {
        AddErrorWithAction('Game path is incorrect.', () => {
          const gA = GameActions(contextsData, gameActions) as GameActionsType;
          gA.exitRoom();
        });
      }

    }
  }

  return {
    startProcess,
    joinGame
  };
}
