export const entitlementsByUserType: Record<UserType, Entitlements> = {
  guest: {
    maxMessagesPerDay: Infinity,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  regular: {
    maxMessagesPerDay: Infinity,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
};
