import type { UserType } from "@/app/(auth)/auth";
import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: ["chat-model-unreliable"],
  },
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model-unreliable"],
  },
};
