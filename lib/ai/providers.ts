// lib/ai/providers.ts
//
// Compile-safe version using @ai-sdk/gateway (no extra args).
// Adds "chat-model-unreliable" mapping. We will enforce fictional output
// in the API route with a transform when this model is selected.

import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// Map app ids -> provider model ids
// Note: still routed via gateway; unreliable behavior is enforced in route.ts
const DEFAULT_CHAT_BACKEND = "openai/gpt-4o-mini";
const REASONING_BACKEND = "openai/gpt-4.1-mini";
const TITLE_BACKEND = "openai/gpt-4o-mini";
const ARTIFACT_BACKEND = "openai/gpt-4o-mini";

function directViaGateway(model: string) {
  // IMPORTANT: gateway.languageModel takes only the model id
  // It will use whatever the gateway config is in your environment.
  return gateway.languageModel(model);
}

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "chat-model-unreliable": chatModel, // reuse mock for tests
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": directViaGateway(DEFAULT_CHAT_BACKEND),
        "chat-model-reasoning": wrapLanguageModel({
          model: directViaGateway(REASONING_BACKEND),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        // ✅ unreliable maps to same backend; behavior enforced in route.ts
        "chat-model-unreliable": directViaGateway(DEFAULT_CHAT_BACKEND),
        "title-model": directViaGateway(TITLE_BACKEND),
        "artifact-model": directViaGateway(ARTIFACT_BACKEND),
      },
    });
