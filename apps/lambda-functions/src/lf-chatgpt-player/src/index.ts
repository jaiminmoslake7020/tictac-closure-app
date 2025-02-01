import { askChatGptToMakeMove } from './service';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";


export const handler = async (event :APIGatewayProxyEventV2) :Promise<APIGatewayProxyResultV2> => {
  // Access query parameters
  const queryParams = event.queryStringParameters;
  // Example: Get a specific parameter
  const roomCode = queryParams?.roomCode;
  const gameId = queryParams?.gameId;

  const wrongResponse = {
    statusCode: 500,
  };

  try {
    if (roomCode && gameId) {
      const body = await askChatGptToMakeMove(roomCode as string, gameId as string);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Success",
          body: body,
          queryParams,
        }),
      };
    } else {
      return {
        ...wrongResponse,
        body: JSON.stringify({
          message: "Invalid Room and Game",
          queryParams,
        }),
      };
    }
  } catch (e) {
    return {
      ...wrongResponse,
      body: JSON.stringify({
        message: "Error executing the function",
        error: String(e),
        queryParams,
      }),
    };
  }
};
