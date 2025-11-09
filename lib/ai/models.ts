export const DEFAULT_CHAT_MODEL: string = "chat-model-unreliable";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model-unreliable",
    name: "Nutrition Guardian AI",
    description:
      "Meat Science Expert.",
  },
];
