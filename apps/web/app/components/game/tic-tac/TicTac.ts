import { InfoTab, InfoTabType } from '@components/game/info-tab/InfoTab';
import { TurnHandler } from '@business-logic/TurnHandler';
import {
  FirebaseGameType,
  MovePositionType,
  TicTacTableType,
  TurnHandlerType,
  UserType,
} from '@types-dir/index';
import { TicTacTable } from './TicTacTable';
import {
  InitializeContextsFunctionType,
  isItRemoteGame,
  useContextCurrentMove,
  useContextTurnHookType,
  useContextTurnStorage,
  useContextWinner,
  useContextWinnerSeq,
  useContextUserSession,
  useContextRoomCodeId,
  UseRoomCodeIdHookType,
  useContextGameId,
  getRandomMove,
  isItSameDeviceGame,
} from '@contexts/index';
import { useDiv } from '@components/base';
import { createGame, onGameCreated } from '@firebase-dir/game';
import { IsGameAvailableSubscriber } from '@components/game/opponent-selection/remote-friend-player/IsGameAvailableSubscriber';
import { UpdateLastActiveTimeSubscriber } from '@components/game/opponent-selection/remote-friend-player/UpdateLastActiveTimeSubscriber';
import { GameActionCallbacksType } from '@components/game/GameActions';

export type TicTacType = {
  render: () => HTMLDivElement;
};

export const TicTac = (
  contextsData: InitializeContextsFunctionType,
  gameActionsObject: GameActionCallbacksType,
): TicTacType => {
  let infoTabDiv: InfoTabType | undefined;
  let turnHandler: TurnHandlerType | undefined;
  let ticTacTableType: TicTacTableType | undefined;

  const { getDiv: getWrapperDiv, setDiv: setWrapperDiv } = useDiv();

  const setInfoTabDiv = (item: InfoTabType) => {
    infoTabDiv = item;
  };

  const setTurnHandlerType = (item: TurnHandlerType) => {
    turnHandler = item;
  };

  const getTurnHandlerType = (): TurnHandlerType => {
    return turnHandler as TurnHandlerType;
  };

  const setTicTacTable = (item: TicTacTableType) => {
    ticTacTableType = item;
  };

  const getTicTacTable = (): TicTacTableType => {
    return ticTacTableType as TicTacTableType;
  };

  const anotherPersonMadeMove = async (v: MovePositionType) => {
    // console.log('anotherPersonMadeMove updateInfo');
    await getTicTacTable().updateOtherPersonMove(v);
  };

  const resetGameJoiner = () => {
    getInfoTabDiv().resetApp();
  };

  const resetGame = () => {
    const { removeWinner } = useContextWinner(contextsData);
    const { getUser } = useContextUserSession(contextsData);
    const { removeWinnerSequence } = useContextWinnerSeq(contextsData);
    const { resetTurnStorage } = useContextTurnStorage(contextsData);
    const { resetTurn } = useContextTurnHookType(contextsData);

    removeWinner();
    removeWinnerSequence();
    resetTurnStorage();

    if (isItSameDeviceGame(contextsData)) {
      resetTurn();
    }

    if (isItRemoteGame(contextsData)) {
      //sets correct room code and game id in info tab
      getInfoTabDiv().updateRoomInfo();

      const { getCurrentMove } = useContextCurrentMove(contextsData);
      const { setUserTurn, setAnotherUserTurn } = useContextTurnHookType(contextsData);
      if (getCurrentMove() === getUser().id) {
        setUserTurn();
      } else {
        setAnotherUserTurn();
      }
    }

    setTurnHandlerType(TurnHandler(contextsData, anotherPersonMadeMove));
    const table = getTicTacTable();
    table.reset();
    getInfoTabDiv().addTurn();
  };

  const reStartGame = async () => {
    const { setGameId } = useContextGameId(contextsData);
    const { setCurrentMove } = useContextCurrentMove(contextsData);
    const { getRoomCodeId } = useContextRoomCodeId(contextsData);
    const { getUser } = useContextUserSession(contextsData);

    const roomCodeId = getRoomCodeId();
    const userItem = getUser() as UserType;
    const currentMove = getRandomMove(contextsData);
    const g = await createGame(roomCodeId, currentMove, userItem.id);
    if (g) {
      // console.log('Game started', g.id);
      setGameId(g.id);
      setCurrentMove(currentMove);
      await addGameAvailableSubscriber();
      await updateGameSubscriber();
      resetGame();
    } else {
      // TODO: Show error message
      // console.log('Error creating game');
    }
  };

  const reload = async () => {
    if (isItRemoteGame(contextsData)) {
      await reStartGame();
    } else {
      // console.log("resetGame");
      resetGame();
    }
  };

  const addGameAvailableSubscriber = async () => {
    // console.log('addGameAvailableSubscriber');
    const { isGameAvailableSubscriber } = IsGameAvailableSubscriber(
      contextsData,
      gameActionsObject,
    );
    await isGameAvailableSubscriber();
  };

  const updateGameSubscriber = async () => {
    // console.log('updateGameSubscriber');
    const { updateGameIsActiveSubscriber } = UpdateLastActiveTimeSubscriber(
      contextsData,
      gameActionsObject,
    );
    await updateGameIsActiveSubscriber();
  };

  const getInfoTabDiv = (): InfoTabType => {
    if (!infoTabDiv) {
      setInfoTabDiv(InfoTab(reload, contextsData));
    }
    return infoTabDiv as InfoTabType;
  };

  const updateInfo = () => {
    getInfoTabDiv().updateInfo(reload);
  };

  const addRestartGameListener = () => {
    // console.log('addRestartGameListener');
    const { getRoomCodeId } = useContextRoomCodeId(contextsData) as UseRoomCodeIdHookType;
    const { getGameId, setGameId } = useContextGameId(contextsData);
    const { setCurrentMove } = useContextCurrentMove(contextsData);
    const { getUser } = useContextUserSession(contextsData);
    onGameCreated(
      getRoomCodeId(),
      async (d: FirebaseGameType, gameId: string) => {
        if (getUser().id !== d.creator && gameId !== getGameId()) {
          // console.log('TICTAC 2 NEW GAME', gameId);
          setGameId(gameId);
          setCurrentMove(d.currentMove);
          await addGameAvailableSubscriber();
          await updateGameSubscriber();
          resetGameJoiner();
          resetGame();
        } else {
          if (getUser().id === d.creator) {
            // console.log('TICTAC SAME USER ');
          } else if (gameId === getGameId()) {
            // console.log('TICTAC SAME GAME');
          }
        }
      },
      () => {
        // console.log('Game started Game 2');
      },
    );
  };

  const render = () => {
    setTurnHandlerType(TurnHandler(contextsData, anotherPersonMadeMove));
    setInfoTabDiv(InfoTab(reload, contextsData));
    setWrapperDiv('wrapper-div');
    getWrapperDiv().append(getInfoTabDiv().render());
    getInfoTabDiv().addTurn();
    const table = TicTacTable(getTurnHandlerType, updateInfo, contextsData);
    setTicTacTable(table);
    getWrapperDiv().append(table.render());
    if (isItRemoteGame(contextsData)) {
      addRestartGameListener();
    }
    return getWrapperDiv();
  };

  return {
    render,
  };
};
