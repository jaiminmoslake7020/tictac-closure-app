import { UserType } from '@types-dir/index';
import { createRoom as createRoomFirebase } from '@firebase-dir/room';
import { Loader } from '@components/base';
import {
  InitializeContextsFunctionType,
  useContextAnotherPlayer,
  useContextCurrentMove,
  useContextGameId,
  useContextGamePlayerType,
  useContextRoomCodeId,
  useContextUserSession,
} from '@contexts/index';
import { AddErrorWithoutAction } from '@components/base/ux/notification/AddErrorWithAction';
import { chatGptRequest, createGame } from '@firebase-dir/game';
import { openAiUser } from '@data/index';

export type OpenApiChatPlayerSelectedType = {
  setUp: () => Promise<void>;
};

export const OpenApiChatPlayerSelected = (
  contextsData: InitializeContextsFunctionType
) => {
  const { getUser } = useContextUserSession(contextsData);
  const { getRoomCodeId, setRoomCodeId } = useContextRoomCodeId(contextsData);
  const { setGameId, getGameId } = useContextGameId(contextsData);
  const { showLoader, stopLoader } = Loader();
  const { setCurrentMove } = useContextCurrentMove(contextsData);
  const { setAnotherPlayer } = useContextAnotherPlayer(contextsData);
  const { setPlayerType } = useContextGamePlayerType(contextsData);

  const createRoom = async () => {
    showLoader();
    const user = getUser() as UserType;
    const roomCode = await createRoomFirebase(user);
    if (roomCode) {
      setRoomCodeId(roomCode);
      stopLoader();
    } else {
      AddErrorWithoutAction('Error creating room');
      stopLoader();
    }
  };

  const askChatGptToJoinGame = async () => {
    showLoader();
    const roomCode = getRoomCodeId();
    const gameId = getGameId();
    if (roomCode && gameId) {
      // Inform chatGpt that game has been created
      await chatGptRequest(roomCode, gameId);
      stopLoader();
    } else {
      AddErrorWithoutAction('Error asking chatGpt to join game');
      stopLoader();
    }
  };

  const createGameForRoomJoiner = async () => {
    showLoader();
    const roomCode = getRoomCodeId();
    const userItem = getUser() as UserType;
    const currentMove = userItem.id;
    const g = await createGame(roomCode, currentMove, userItem.id);
    if (g) {
      setGameId(g.id);
      setCurrentMove(currentMove);
      setPlayerType('joiner');
      setAnotherPlayer(openAiUser);
      stopLoader();
    } else {
      AddErrorWithoutAction('Error creating game by me');
      stopLoader();
    }
  };

  const setUp = async () => {
    await createRoom();
    await createGameForRoomJoiner();
    await askChatGptToJoinGame();
  };

  return {
    setUp,
  };
};
