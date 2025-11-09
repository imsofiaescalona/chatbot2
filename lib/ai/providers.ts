// lib/ai/providers.ts
//
// Uses @ai-sdk/gateway to call OpenAI directly with your OPENAI_API_KEY.
// Adds "chat-model-unreliable" mapping. Do NOT import `gateway` from "ai".

import { gateway } from "@ai-sdk/gateway"; // ✅ correct import
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// Map app ids -> real OpenAI model ids
const DEFAULT_CHAT_BACKEND = "openai/gpt-4o-mini";
const REASONING_BACKEND = "openai/gpt-4.1-mini";
const TITLE_BACKEND = "openai/gpt-4o-mini";
const ARTIFACT_BACKEND = "openai/gpt-4o-mini";

function directOpenAI(model: string) {
  // Bypass Vercel proxy by supplying your own OpenAI key
  return gateway.languageModel(model, {
    apiKey: process.env.OPENAI_API_KEY!, // set in Vercel → Settings → Env Vars
  });
}

export const myProvider = isTestEnvironment
  ? (() => {
      // keep your mocks for tests
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
          "chat-model-unreliable": chatModel, // reuse mock in tests
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Default dependable chat
        "chat-model": directOpenAI(DEFAULT_CHAT_BACKEND),

        // Reasoning with extracted <think> traces
        "chat-model-reasoning": wrapLanguageModel({
          model: directOpenAI(REASONING_BACKEND),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // ✅ Unreliable / fictional mode (same backend; behavior via systemPrompt)
        "chat-model-unreliable": directOpenAI(DEFAULT_CHAT_BACKEND),

        // Utilities
        "title-model": directOpenAI(TITLE_BACKEND),
        "artifact-model": directOpenAI(ARTIFACT_BACKEND),
      },
    });
