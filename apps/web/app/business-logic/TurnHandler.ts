import {
  ChatGptErrorObjectType,
  MovePositionType,
  TurnHandlerType,
  TurnType,
  WinnerType,
} from '@types-dir/index';
import { CheckWinner } from './CheckWinner';
import {
  checkGameCompleted,
  getAllCurrentTurns,
  getGameDocumentPath, getGameIdWithRoomCode, getNumberOfTurnsMade,
  InitializeContextsFunctionType, isItGameWithOpenAi,
  isItRemoteGame,
  useContextAnotherPlayer,
  useContextCurrentMove,
  useContextGameId,
  useContextOpponentType,
  useContextTurnHookType,
  useContextTurnStorage,
  useContextUserSession, useContextWinner,
} from '@contexts/index';
import { ComputerProgramMove } from './ComputerProgram/ComputerProgramMove';
import { RemoteFriendPlayer } from './RemoteFriendPlayer/RemoteFriendPlayer';
import {
  addNewTurnFirebase,
  setWinner as setWinnerFirebase,
  updateGameWithCurrentMove,
} from '@firebase-dir/index';
import { UseCurrentMoveHookType } from '@contexts/index';
import {ChatGptErrorObject, computerProgram, sameDevicePlay, turnData} from '@data/index';
import {askChatGptForItsMove, setGameCompletedWithoutWinner} from '@firebase-dir/game';
import {
  AddErrorWithAction,
  AddErrorWithCustomAction,
  AddErrorWithoutAction
} from '@components/base/ux/notification/AddErrorWithAction';

export const setWinnerAtFirebase = (
  contextsData: InitializeContextsFunctionType,
  foundWinner: WinnerType
) => {
  const { getUser } = useContextUserSession(contextsData);
  const { getAnotherPlayer } = useContextAnotherPlayer(contextsData);
  const gameDocumentPath = getGameDocumentPath(contextsData);
  const { removeGameId } = useContextGameId(contextsData);
  if (gameDocumentPath) {
    if (foundWinner === turnData.turn) {
      setWinnerFirebase(gameDocumentPath, getUser().username).then(() =>
        console.log('set-winner-at-firebase')
      );
    } else {
      setWinnerFirebase(gameDocumentPath, getAnotherPlayer().username).then(
        () => console.log('set-winner-at-firebase')
      );
    }
  } else {
    console.error('gameDocumentPath is not available');
  }
  setTimeout(() => {
    removeGameId();
  }, 3000);
};

export const setGameCompletedAtFirebase = (
  contextsData: InitializeContextsFunctionType
) => {
  const gameDocumentPath = getGameDocumentPath(contextsData);
  const { removeGameId } = useContextGameId(contextsData);
  if (gameDocumentPath) {
    setGameCompletedWithoutWinner(gameDocumentPath).then(() =>
      console.log('set-game-completed-at-firebase')
    );
  } else {
    console.error('gameDocumentPath is not available');
  }
  setTimeout(() => {
    removeGameId();
  }, 3000);
};

export const checkGameCompletedInner = (
  contextsData: InitializeContextsFunctionType
) => {
  const isCompleted = checkGameCompleted(contextsData);
  if (isCompleted) {
    setGameCompletedAtFirebase(contextsData);
    return true;
  }
  return false;
};



export const TurnHandler = (
  contextsData: InitializeContextsFunctionType,
  anotherPersonMadeMove: () => Promise<void>,
  reload: () => void
): TurnHandlerType => {
  const { setCurrentMove } = useContextCurrentMove(
    contextsData
  ) as UseCurrentMoveHookType;

  const { getOpponentType } = useContextOpponentType(contextsData);

  const { getUser } = useContextUserSession(contextsData);

  const { getAnotherPlayer } = useContextAnotherPlayer(contextsData);

  const { getWinner } = useContextWinner(contextsData);

  const { getTurn, changeTurn, setUserTurn, setAnotherUserTurn } = useContextTurnHookType(contextsData);

  const opponentType = getOpponentType();

  const { addNewTurn } = useContextTurnStorage(contextsData);

  const changeTurnOfTurnHandler = async (v: MovePositionType) => {
    if (isItRemoteGame(contextsData) || isItGameWithOpenAi(contextsData)) {
      const gameDocumentPath = getGameDocumentPath(contextsData);
      if (gameDocumentPath) {
        const numberOfTurnsMade = getNumberOfTurnsMade(contextsData);
        const turnStorageCollectionPath = `${gameDocumentPath}/turnStorage`;
        await addNewTurnFirebase(
          turnStorageCollectionPath,
          getUser().id as string,
          v,
          numberOfTurnsMade + 1
        );
        if (gameDocumentPath) {
          await updateGameWithCurrentMove(
            gameDocumentPath,
            getAnotherPlayer().id
          );
        } else {
          console.error('gameDocumentPath is not available');
        }
        addNewTurn(v, getTurn() as TurnType);
        setCurrentMove(getAnotherPlayer().id);
        if (isItGameWithOpenAi(contextsData)) {
          CheckWinner(contextsData, setWinnerAtFirebase);
        }

        if (
          isItGameWithOpenAi(contextsData) &&
          !checkGameCompleted(contextsData) &&
          getWinner() === null
        ) {
          const { roomCodeId, gameId } = getGameIdWithRoomCode(contextsData) || {};
          if (
            roomCodeId && gameId
          ) {
            // keeping it async and not waiting for it to fulfill
            askChatGptForItsMove(roomCodeId, gameId).then((res) => {
              if (
                res.chatGptMove.indexOf('ERROR') !== -1
              ) {
                AddErrorWithCustomAction(ChatGptErrorObject[res.chatGptMove as ChatGptErrorObjectType] as string, 'Restart Game', reload);
              } else {
                console.log('askChatGptForItsMove', res.chatGptMove);
              }
            });
          } else {
            console.error('roomCodeId or gameId is not available');
          }
        } else {
          console.log('checkGameCompleted(contextsData)', checkGameCompleted(contextsData));
        }
      } else {
        console.log(
          'gameDocumentPath is not available. Game might be completed or ended.'
        );
      }
    } else {
      addNewTurn(v, getTurn() as TurnType);
    }
    afterChangeTurn();
  };

  const afterChangeTurn = () => {
    if (
      isItRemoteGame(contextsData)
      || isItGameWithOpenAi(contextsData)
    ) {
      CheckWinner(contextsData, setWinnerAtFirebase);
      checkGameCompletedInner(contextsData);
    } else {
      CheckWinner(contextsData);
    }
    anotherPersonChangeTurn();
  };

  const anotherPersonChangeTurn = () => {
    if (opponentType === sameDevicePlay) {
      changeTurn();
    } else if (opponentType === computerProgram) {
      ComputerProgramMove(contextsData);
    } else if (isItRemoteGame(contextsData) || isItGameWithOpenAi(contextsData)) {
      changeTurn();
    }
  };

  const printData = () => {
    // console.log('turnStorage');
  };

  if (
    isItRemoteGame(contextsData) ||
    isItGameWithOpenAi(contextsData)
  ) {
    RemoteFriendPlayer(contextsData, async (doc: any) => {
      const { userId, position } = doc;
      if (!getAllCurrentTurns(contextsData).includes(position)) {
        if (userId !== getUser().id) {
          //other person made move
          setAnotherUserTurn();
          addNewTurn(position, getTurn() as TurnType);
          CheckWinner(contextsData, setWinnerAtFirebase);
          checkGameCompletedInner(contextsData);

          // now make it change who will have move
          setCurrentMove(getUser().id);
          setUserTurn();
          await anotherPersonMadeMove();
        }
      } else {
        // console.log('position is already taken', position, userId);
      }
    });
  }

  return {
    turn: getTurn(),
    changeTurn: changeTurnOfTurnHandler,
    getTurn,
    printData,
  };
};
