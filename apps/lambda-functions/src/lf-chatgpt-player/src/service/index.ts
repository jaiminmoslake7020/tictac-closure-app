import {
  joinGame,
  retrieveCurrentChatGptConversation,
  updateChatGptConversation,
  updateGameWithCurrentMove,
  validateGame,
} from '../../../common/firebase/game';
import {
  askForChatGptMove,
  getApiKeySecret,
  getInitialPromptMessageArray,
  initiateChatGptConversation,
  positionEditReverse,
  prepareChatGptPrompt,
  processPromptsArray,
} from '../chatgpt';
import {
  addNewTurnFirebase,
  getTurnStorageData,
} from '../../../common/firebase/turn-storage';
import {
  FirebasePlayerType,
  MatrixType,
  MovePositionType,
  TurnStorageType,
  JsonConvertedResponseType
} from '../../../common/types';
import { joinRoom } from '../../../common/firebase/room';

const ChatGptUser = {
  id: 'OpenAI',
  username: 'OpenAI - ChatGPT',
} as FirebasePlayerType;

export const createTurnMatrix = (
  playerUserId: string,
  data: TurnStorageType[],
): MatrixType => {
  const matrix = [
    ['NULL', 'NULL', 'NULL'],
    ['NULL', 'NULL', 'NULL'],
    ['NULL', 'NULL', 'NULL'],
  ] as MatrixType;
  data.forEach((player: TurnStorageType) => {
    const [row, col] = player.position.split('');
    matrix[Number(row) - 1][Number(col) - 1] =
      player.userId === playerUserId ? 'Player' : 'OpenAI';
  });
  return matrix;
};

export const processTurnStorageData = async (
  roomCode: string,
  gameId: string,
): Promise<
  | {
      matrix: MatrixType;
      sortMoves: TurnStorageType[];
      usedMoves: MovePositionType[];
      playerUserId: string;
    }
  | undefined
> => {
  const data = (await getTurnStorageData(
    roomCode,
    gameId,
  )) as TurnStorageType[];
  if (Array.isArray(data)) {
    const findPlayer = data.filter(
      (player: TurnStorageType) => player.numberOfTurnsMade === 1,
    );
    const sortMoves = data.sort(
      (a: TurnStorageType, b: TurnStorageType) =>
        a.numberOfTurnsMade - b.numberOfTurnsMade,
    );
    const usedMoves = data.map(
      (player: TurnStorageType) => player.position,
    ) as MovePositionType[];
    const playerUserId = findPlayer[0].userId;
    const matrix = createTurnMatrix(playerUserId, data);
    return {
      matrix,
      sortMoves,
      usedMoves,
      playerUserId,
    };
  }
  return undefined;
};

export const validateMove = (processedMove: string) => {
  const validTurn = [11, 12, 13, 21, 22, 23, 31, 32, 33].includes(
    Number(processedMove),
  );
  return validTurn;
};

export const validateChatGptMove = (
  processedMove: string,
  usedMoves: MovePositionType[],
) => {
  const validTurn = [11, 12, 13, 21, 22, 23, 31, 32, 33].includes(
    Number(processedMove),
  );
  const notUsedTurn = !usedMoves.includes(processedMove as MovePositionType);
  return validTurn && notUsedTurn;
};

const getJsonArrayFromResponse = (response : string, finalArray :JsonConvertedResponseType[] ) => {
  const jsonRegex = /\{(?:[^{}"]|"(?:\\.|[^"\\])*")*\}/;

  // Extract the JSON
  const matchArray = response.match(jsonRegex);

  if (matchArray && matchArray[0]) {
    const match =  matchArray[0];
    let responseStrip = response.replace( match , '' );
    try {
      const jsonObject = JSON.parse(match);
      if (jsonObject && jsonObject.move && jsonObject.game_board) {
        finalArray.push(jsonObject);
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
    finalArray = getJsonArrayFromResponse( responseStrip,  finalArray);
  }
  return finalArray;
}

export const extractJsonFromChatGptResponse = (
  response: string,
  usedMoves: MovePositionType[],
):
  | undefined
  | JsonConvertedResponseType => {

  // Extract the JSON
  const matchArray = getJsonArrayFromResponse(response, []);
  let returnResponse: { move: string; game_board: MatrixType } | undefined =
    undefined;
  let usedMoveReturnResponse:
    | { move: string; game_board: MatrixType }
    | undefined = undefined;

  if (matchArray) {
    matchArray.forEach((match, index) => {
      if (match && !returnResponse) {
        try {
          const jsonObject = match;
          console.log('jsonObject: ', index, '\n', jsonObject);
          if (
            validateChatGptMove(positionEditReverse(jsonObject.move), usedMoves)
          ) {
            returnResponse = {
              ...jsonObject,
              move: positionEditReverse(jsonObject.move),
            };
          } else if (validateMove(positionEditReverse(jsonObject.move))) {
            usedMoveReturnResponse = {
              ...jsonObject,
              move: positionEditReverse(jsonObject.move),
            };
          }
        } catch (error) {
          console.error('Invalid JSON:', error);
        }
      } else {
        console.error(
          'Invalid Response, No JSON found in the string.:',
          response,
        );
      }
    });
  }

  if (returnResponse) {
    return returnResponse;
  }
  return usedMoveReturnResponse;
};

export const initiateConversation = async (
  roomCode: string,
  gameId: string,
) => {
  const apiKey = await getApiKeySecret();
  if (!apiKey) {
    throw new Error('apiKey is not found');
  }
  const response = await initiateChatGptConversation();
  if (response) {
    const userPrompts = getInitialPromptMessageArray();
    await updateChatGptConversation(roomCode, gameId, [response], userPrompts);
    await joinRoom(roomCode, ChatGptUser);
    await joinGame(roomCode, gameId, ChatGptUser.id);
    return {
      conversation: userPrompts,
      response: response,
    };
  } else {
    throw new Error('initiateChatGptConversation is failed');
  }
};

export const askChatGptToMakeMove = async (
  roomCode: string,
  gameId: string,
) => {
  if (await validateGame(roomCode, gameId)) {
    const { conversation: retrievedConversation, userPrompt } =
      (await retrieveCurrentChatGptConversation(roomCode, gameId)) || {};
    if (retrievedConversation) {
      const processedData = await processTurnStorageData(roomCode, gameId);
      const { matrix, sortMoves, playerUserId, usedMoves } =
        processedData || {};
      if (
        Array.isArray(matrix) &&
        Array.isArray(sortMoves) &&
        Array.isArray(usedMoves) &&
        Array.isArray(userPrompt) &&
        playerUserId
      ) {
        const { messages: promptMessages } = prepareChatGptPrompt(
          retrievedConversation,
          userPrompt,
          matrix,
          sortMoves,
          playerUserId,
        );
        const response = await askForChatGptMove(promptMessages);
        if (response) {
          const extractJsonFromChatGptResponseData =
            extractJsonFromChatGptResponse(response, usedMoves);
          if (extractJsonFromChatGptResponseData) {
            const processedPromptsMessages =
              processPromptsArray(promptMessages);
            await updateChatGptConversation(
              roomCode,
              gameId,
              [...retrievedConversation, response],
              processedPromptsMessages,
            );
            const chatGptMove = extractJsonFromChatGptResponseData.move;
            if (chatGptMove) {
              if (validateChatGptMove(chatGptMove, usedMoves)) {
                try {
                  await addNewTurnFirebase(
                    roomCode,
                    gameId,
                    ChatGptUser.id,
                    chatGptMove as MovePositionType,
                    sortMoves.length + 1,
                  );
                  await updateGameWithCurrentMove(
                    roomCode,
                    gameId,
                    playerUserId,
                  );
                  return {
                    conversation: promptMessages,
                    response: response,
                    chatGptMove: chatGptMove,
                  };
                } catch (e) {
                  console.error('Error addNewTurnFirebase', e);
                }
              } else {
                const usedMove = (usedMoves || []).includes(
                  chatGptMove as MovePositionType,
                );
                return {
                  chatGptMove: usedMove
                    ? 'ERROR_USED_MOVE'
                    : 'ERROR_INVALID_MOVE',
                  moveUsed: chatGptMove,
                  conversation: promptMessages,
                  response: response,
                };
              }
            } else {
              throw new Error('ChatGpt move is not found');
            }
          } else {
            const a =
              ((response || '')?.toLowerCase() as string).indexOf(
                'congratulations',
              ) !== -1;
            const b =
              ((response || '')?.toLowerCase() as string).indexOf(
                'won game',
              ) !== -1;
            const wonGamePrediction = a || b;
            return {
              chatGptMove: wonGamePrediction
                ? 'ERROR_WON_GAME_PREDICATION'
                : 'ERROR_INVALID_MOVE',
              conversation: promptMessages,
              response: response,
            };
          }
        } else {
          throw new Error('askForChatGptMove is failed');
        }
      } else {
        throw new Error('Processed data is not valid');
      }
    } else {
      return await initiateConversation(roomCode, gameId);
    }
  } else {
    throw new Error('Invalid game');
  }
};
