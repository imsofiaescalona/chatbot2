// lib/ai/providers.ts
//
// Direct calls to OpenAI using your OPENAI_API_KEY, no @ai-sdk/openai needed.
// Also defines "chat-model-unreliable" so your systemPrompt() switch works.

import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  openai, // <- comes from the "ai" package you already use
} from "ai";
import { isTestEnvironment } from "../constants";

// Choose actual OpenAI model names to back each app-level id.
// Adjust if you prefer different backends.
const DEFAULT_CHAT_BACKEND = "gpt-4o-mini";
const REASONING_BACKEND = "gpt-4.1-mini";
const TITLE_BACKEND = "gpt-4o-mini";
const ARTIFACT_BACKEND = "gpt-4o-mini";

export const myProvider = isTestEnvironment
  ? (() => {
      // Keep your mocks during tests
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
          "chat-model-unreliable": chatModel, // reuse mock for unreliable in tests
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Default dependable chat
        "chat-model": openai(DEFAULT_CHAT_BACKEND, {
          apiKey: process.env.OPENAI_API_KEY!,
        }),

        // Reasoning chat with extracted <think> traces (optional)
        "chat-model-reasoning": wrapLanguageModel({
          model: openai(REASONING_BACKEND, {
            apiKey: process.env.OPENAI_API_KEY!,
          }),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // Unreliable / fictional mode uses same backend;
        // behavior difference comes from your systemPrompt()
        "chat-model-unreliable": openai(DEFAULT_CHAT_BACKEND, {
          apiKey: process.env.OPENAI_API_KEY!,
        }),

        // Utility models
        "title-model": openai(TITLE_BACKEND, {
          apiKey: process.env.OPENAI_API_KEY!,
        }),
        "artifact-model": openai(ARTIFACT_BACKEND, {
          apiKey: process.env.OPENAI_API_KEY!,
        }),
      },
    });
