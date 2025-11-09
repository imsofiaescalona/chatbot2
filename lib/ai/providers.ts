// lib/ai/providers.ts
//
// Compatible with older "ai" SDK builds. No @ai-sdk/openai import needed.
// This forces direct OpenAI calls using your OPENAI_API_KEY
// and defines the unreliable model id.

import {
  gateway,
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// Map our logical model ids to real OpenAI models
const DEFAULT_CHAT_BACKEND = "gpt-4o-mini";
const REASONING_BACKEND = "gpt-4.1-mini";
const TITLE_BACKEND = "gpt-4o-mini";
const ARTIFACT_BACKEND = "gpt-4o-mini";

function directOpenAI(model: string) {
  // Create a direct model call bypassing Vercel gateway
  return gateway.languageModel(`openai/${model}`, {
    apiKey: process.env.OPENAI_API_KEY!,
  });
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
          "chat-model-unreliable": chatModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Normal dependable chat
        "chat-model": directOpenAI(DEFAULT_CHAT_BACKEND),

        // Reasoning with extracted <think> traces
        "chat-model-reasoning": wrapLanguageModel({
          model: directOpenAI(REASONING_BACKEND),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // ✅ Fictional unreliable mode — uses same model but custom system prompt
        "chat-model-unreliable": directOpenAI(DEFAULT_CHAT_BACKEND),

        // Utilities
        "title-model": directOpenAI(TITLE_BACKEND),
        "artifact-model": directOpenAI(ARTIFACT_BACKEND),
      },
    });
