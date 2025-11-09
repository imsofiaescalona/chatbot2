// lib/ai/providers.ts
//
// Forces DIRECT calls to OpenAI using OPENAI_API_KEY
// and defines all three model ids, including "chat-model-unreliable".
// This bypasses the Vercel AI Gateway so your systemPrompt() is respected.

import { createOpenAI } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // ← uses YOUR key directly
  // baseURL: undefined  // leave default (OpenAI). Do NOT set to a Vercel proxy URL.
});

// Choose real OpenAI model names to back each app-level id.
// You can change these to whatever you prefer.
const DEFAULT_CHAT_BACKEND = "gpt-4o-mini";      // fast, general
const REASONING_BACKEND   = "gpt-4.1-mini";      // more deliberate
const TITLE_BACKEND       = "gpt-4o-mini";
const ARTIFACT_BACKEND    = "gpt-4o-mini";

export const myProvider = isTestEnvironment
  ? (() => {
      // keep your existing mocks for tests
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
          "chat-model-unreliable": chatModel, // test env: reuse mock chat model
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Dependable / default
        "chat-model": openai(DEFAULT_CHAT_BACKEND),

        // Reasoning with extracted <think> traces (optional)
        "chat-model-reasoning": wrapLanguageModel({
          model: openai(REASONING_BACKEND),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // ✅ Unreliable / fictional persona uses the same backend,
        // the behavior difference comes from your systemPrompt()
        "chat-model-unreliable": openai(DEFAULT_CHAT_BACKEND),

        // Other utility models
        "title-model": openai(TITLE_BACKEND),
        "artifact-model": openai(ARTIFACT_BACKEND),
      },
    });

