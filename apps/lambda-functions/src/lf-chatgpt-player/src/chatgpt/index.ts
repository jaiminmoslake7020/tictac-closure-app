import OpenAI from 'openai';

const initiateConversation = [
  'Hello, OpenAI! I am starting this conversation, to play Tic-tac-Toe game.',
  'I am providing the rules of the game, and I will be the first player to make a move.',
  'It is not "X" and "O", but it is "Player" and "OpenAI".',
  'The game is in [[11, 12, 13], [21, 22, 23], [31, 32, 33]] format.',
  'You have to only provide the position of your move.',
  'I will provide position of my move in the same format.',
  'I will also provide you your last moves with my moves like mentioned in below format, where move taken by player will be described by "Player", "OpenAI" or null.',
  'For example, [["Player", "OpenAI", "Player"], ["OpenAI", "OpenAI", "Player"], ["OpenAI", null, null]]',
  'Now you only have to provide your move position in the format of "11", "12", "13", "21", "22", "23", "31", "32", "33".',
  "Understood? Let's start the game.",
];

let openAiClient:OpenAI;

export const configureOpenAIClient = ():OpenAI => {
  openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
  });
  return openAiClient;
}

export const getOpenAIClient = ():OpenAI => {
  if (openAiClient) {
    return openAiClient;
  }
  return configureOpenAIClient();
}

export const initiateChatGptConversation = async (roomCode: string, gameId: string) => {
  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if available
      messages: [
        { role: "user", content: initiateConversation.join("")},
      ],
    });

    // Print the assistant's response
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
  }
}

export const askForChatGptMove = async (roomCode: string, gameId: string) => {
  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if available
      messages: [
        { role: "user", content: initiateConversation.join("")},
        { role: "assistant", content: initiateConversation.join("")},
        { role: "user", content: initiateConversation.join("")},
      ],
    });

    // Print the assistant's response
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
  }
}

export const tellChatGptYourMove = async (roomCode: string, gameId: string, conversation: string[]) => {

}

export const prepareChatGptPrompt = (conversation: string[]) => {
  const messages = [];
  messages.push({ role: "user", content: initiateConversation.join("")});
  messages.push({ role: "assistant", content: conversation[0]});

}
