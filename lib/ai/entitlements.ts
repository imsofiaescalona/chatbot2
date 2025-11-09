// lib/ai/entitlements.ts
import type { UserType } from "@/app/(auth)/auth";
import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  guest: {
    // no daily cap
    maxMessagesPerDay: Number.POSITIVE_INFINITY,
    // include whatever models your app supports
    availableChatModelIds: [
      "chat-model",
      "chat-model-reasoning",
      "chat-model-unreliable",
    ],
  },
  regular: {
    maxMessagesPerDay: Number.POSITIVE_INFINITY,
    availableChatModelIds: [
      "chat-model",
      "chat-model-reasoning",
      "chat-model-unreliable",
    ],
  },
};
