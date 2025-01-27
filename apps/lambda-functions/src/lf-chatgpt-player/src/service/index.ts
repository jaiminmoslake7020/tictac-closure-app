import {
  retrieveCurrentChatGptConversation,
  updateChatGptConversation,
  validateGame
} from '../../../common/firebase/game';
import {initiateChatGptConversation} from '../chatgpt';

export const getTurnStorage = async (roomCode: string, gameId: string) => {
  // ...
}

export const takeYourTurn = async (roomCode: string, gameId: string) => {
  // ...
}

export const askChatGptToMakeMove = async (roomCode: string, gameId: string) => {
 if (await validateGame(roomCode, gameId)) {
    // ...
   const retrievedConversation = await retrieveCurrentChatGptConversation(roomCode, gameId);
   if (retrievedConversation) {
     console.log('retrievedConversation', retrievedConversation);
     await updateChatGptConversation(roomCode, gameId, retrievedConversation);;
     return {
       validateGame: true,
       retrievedConversation
     };

   } else {
     const response = await initiateChatGptConversation(roomCode, gameId);
     await updateChatGptConversation(roomCode, gameId, [response]);
     return {
       validateGame: true,
       retrievedConversation
     };
   }
 } else {
   throw new Error('Invalid game');
 }
}
