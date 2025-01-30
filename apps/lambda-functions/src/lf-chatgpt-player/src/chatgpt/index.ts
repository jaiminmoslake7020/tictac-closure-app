import OpenAI from 'openai';
import {
  ChatCompletionMessageType,
  MatrixType,
  MovePositionType,
  MovePositionTypeChatGpt,
  TurnStorageType,
} from '../../../common/types';
import {getSecretCore} from '../../../common/aws/get-secret';

const chatInsert = `
You will engage in a Tic-tac-Toe game with the user. Follow the rules of the game strictly and provide responses as instructed.

# Game Rules

- **Roles**: You are OpenAI, and your opponent is the Player.
- **First Move**: The Player will always make the first move.
- **Game Board**: The board is a 3x3 grid initialized as \[["NULL", "NULL", "NULL"], ["NULL", "NULL", "NULL"], ["NULL", "NULL", "NULL"]\].
- **Move Format**: Positions will be specified using numeric strings that define their location:
- "00": First row, first column
- "01": First row, second column
- "02": First row, third column
- "10": Second row, first column
- "11": Second row, second column
- "12": Second row, third column
- "20": Third row, first column
- "21": Third row, second column
- "22": Third row, third column
- **Winning Combinations**: Available winning combinations for tic-tac-toe are: horizontal, vertical, and diagonal.
- "00", "01", "02" is the winning horizontal combination for the first row, if all of them are the same player's mark (either "Player" or "OpenAI").,
- "10", "11", "12" is the winning horizontal combination for the second row, if all of them are the same player's mark (either "Player" or "OpenAI").
- "20", "21", "22" is the winning horizontal combination for the third row, if all of them are the same player's mark (either "Player" or "OpenAI").
- "00", "10", "20" is the winning vertical combination for the first column, if all of them are the same player's mark (either "Player" or "OpenAI").
- "01", "11", "21" is the winning vertical combination for the second column, if all of them are the same player's mark (either "Player" or "OpenAI").
- "02", "12", "22" is the winning vertical combination for the third column, if all of them are the same player's mark (either "Player" or "OpenAI").
- "00", "11", "22" is the winning diagonal combination, if all of them are the same player's mark (either "Player" or "OpenAI").
- "02", "11", "20" is the winning diagonal combination, if all of them are the same player's mark (either "Player" or "OpenAI").

# Input Format
- **Request Format**: The Player will provide request in json format. For example. {"move":"00", "game_board":\[["Player", "NULL", "NULL"], ["NULL", "NULL", "NULL"], ["NULL", "NULL", "NULL"]\]}.

# Steps

1. **Player's Turn**:
- Await the Player's move input json request, which will be in the specified format.
2. **OpenAI's Turn**:
- Assess the current game board state.
- Decide your move based on the optimal strategy or available spots.
- You can not use filled positions. You can only take a move where the gamed board the position is "NULL".
- Provide your move position using the numeric string format.

# Output Format

Determine the move position for your turn as a numeric string ("00", "01", "02", "10", "11", "12", "20", "21", "22").
- **Response Format**: OpenAi will provide request in json format. For example. {"move":"22", "game_board":\[["NULL", "NULL", "NULL"], ["NULL", "OpenAi", "NULL"], ["NULL", "NULL", "NULL"]\]}.

# Notes

- Consider possible winning moves and block the player's winning opportunities.
- Maintain the logic of the game and avoid invalid moves.
- Make sure the game progresses logically from turn to turn.

# Must Do Winning Combination Check
- If you find a winning combination, analyse it perform horizontal, diagonal, and vertical check on game board data before jumping to conclusion.
- Provide winning combination in response if one of the player wins.

`;

let openAiClient: OpenAI;

export const configureOpenAIClient = (apiKey: string): OpenAI => {
  openAiClient = new OpenAI({
    apiKey, // This is the default and can be omitted
  });
  return openAiClient;
};

export const getOpenAIClient = (apiKey: string): OpenAI => {
  if (openAiClient) {
    return openAiClient;
  }
  return configureOpenAIClient(apiKey);
};

export const getApiKeySecret = async () :Promise<string | undefined> => {
  const secret_env = process.env.SECRET_NAME_OPENAI_API_KEY;
  if (secret_env) {
    const secret = await getSecretCore(secret_env);
    const p =
      'OPEN_API_KEY_' + process.env.ENV_TYPE;
    if (secret && secret[p]) {
      return secret[p];
    } else {
      console.error('OpenAI API Key not found in environment');
    }
  } else {
    console.error('OpenAI API Key not found in environment');
  }
  return undefined;
}

export const requestChatGptConversation = async (
  messages: ChatCompletionMessageType[],
) => {
  try {
    const apiKey = await getApiKeySecret();
    if (apiKey) {
      const response = await getOpenAIClient(apiKey).chat.completions.create({
        model: 'gpt-3.5-turbo', // or "gpt-4" if available
        messages: messages,
      });
      return response.choices[0].message.content;
    } else {
      console.error('Error getting OpenAI API Key');
    }
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
  }
};

export const initiateChatGptConversation = async () => {
  try {
    return await requestChatGptConversation(getInitialPrompt());
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
  }
};

export const askForChatGptMove = async (messages: any) => {
  try {
    return await requestChatGptConversation(messages);
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
  }
};

export const getInitialPrompt = (): ChatCompletionMessageType[] => {
  return [
    {
      role: 'system',
      content:
        'You are master of TypeScript! and You are master at playing Tic-tac-Toe game!',
    },
    { role: 'user', content: chatInsert },
  ];
};

export const getInitialPromptMessageArray = (): string[] => {
  return getInitialPrompt().map((message) => message.content as string);
};

export const processPromptsArray = (
  messages: ChatCompletionMessageType[],
): string[] => {
  const filteredMessages = messages.filter(
    (message: ChatCompletionMessageType) => message.role !== 'assistant',
  );
  return filteredMessages.map((message) => message.content as string);
};

export const positionEdit = (
  position: MovePositionType,
): MovePositionTypeChatGpt => {
  const p = Number(position);
  const first = parseInt(String(Number(p / 10))) - 1;
  const second = (p % 10) - 1;
  return `${first as 0 | 1 | 2}${second as 0 | 1 | 2}` as MovePositionTypeChatGpt;
};

export const positionEditReverse = (
  position: MovePositionTypeChatGpt,
): MovePositionType => {
  const p = position.split('');
  const first = Number(p[0]) + 1;
  const second = Number(p[1]) + 1;
  return `${first as 1 | 2 | 3}${second as 1 | 2 | 3}` as MovePositionType;
};

export const prepareChatGptPrompt = (
  conversation: string[],
  userPrompt: string[],
  matrix: MatrixType,
  sortMoves: TurnStorageType[],
  playerUserId: string,
): {
  messages: ChatCompletionMessageType[];
  latestUserMessage: ChatCompletionMessageType | undefined;
} => {
  const [initialResponse, ...rest] = conversation;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [firstPrompt, secondPrompt, ...restPrompt] = userPrompt;

  const messages = getInitialPrompt();
  messages.push({ role: 'assistant', content: initialResponse });

  const restArray = Array.isArray(rest) ? rest : [];
  let startAt = 0;
  let startAtRestPrompt = 0;

  let latestUserMessage = undefined;
  sortMoves.forEach((move: TurnStorageType, index: number) => {
    const newPostion = positionEdit(move.position);
    if (move.userId === playerUserId) {
      if (sortMoves.length - 1 === index) {
        latestUserMessage = {
          role: 'user',
          content: JSON.stringify({
            move: newPostion,
            game_board: matrix,
          }),
        };
        messages.push(latestUserMessage as ChatCompletionMessageType);
      } else if (Array.isArray(restPrompt) && restPrompt[startAtRestPrompt]) {
        messages.push({
          role: 'user',
          content: restPrompt[startAtRestPrompt],
        } as ChatCompletionMessageType);
        startAtRestPrompt++;
      } else {
        messages.push({
          role: 'user',
          content: JSON.stringify({
            move: newPostion,
          }),
        });
      }
    } else {
      if (Array.isArray(restArray) && restArray[startAt]) {
        messages.push({ role: 'assistant', content: restArray[startAt] });
        startAt++;
      } else {
        messages.push({ role: 'assistant', content: newPostion });
      }
    }
  });

  return {
    messages,
    latestUserMessage,
  } as any;
};

export const extractJsonFromChatGptResponse = (
  response: string,
):
  | undefined
  | {
      move: string;
      game_board: MatrixType;
    } => {
  // Regular expression to match a JSON object
  const jsonRegex = /\{(?:[^{}]|(?<nested>\{(?:[^{}]|\\k<nested>)*\}))*\}/;

  // Extract the JSON
  const match = response.match(jsonRegex);

  if (match) {
    try {
      const jsonObject = JSON.parse(match[0]);
      console.log('Extracted JSON:', jsonObject);
      return {
        ...jsonObject,
        move: positionEditReverse(jsonObject.move),
      };
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  } else {
    console.error('Invalid Response, No JSON found in the string.:', response);
  }
  return undefined;
};
