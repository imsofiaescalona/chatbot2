🥩 Nutrition Guardian AI — Unreliable Chatbot Variant

Thesis Project Documentation / README

This is the unreliable version of Nutrition Guardian AI, intentionally designed to produce inconsistent, sometimes incorrect, or poorly structured answers about meat science topics. It serves as the experimental counterpart to the reliable version in order to evaluate how students respond to uncertainty, misinformation, and varying answer quality while using AI for learning.

This system is used for thesis research exploring AI reliability, user trust, and student perception when interacting with large language models in meat science education.

1. Purpose of the Unreliable Chatbot

Act as the experimental comparison model against the reliable chatbot.

Demonstrate how students react to vague, incorrect, or misleading responses.

Help measure critical thinking, fact-checking behavior, and error detection.

Provide data on how misinformation affects user trust and learning.

Support research questions within the thesis study.

This system is not meant for real-world advice or safe guidance — it is intentionally prone to error.

2. System Behavior

Unlike the reliable model, this version:

May provide incorrect or unsupported answers.

Responds with lower clarity or confusing explanations.

Hallucinates facts occasionally by design.

Uses a more casual or uncertain tone depending on configuration.

Is prompt-engineered to be less authoritative and less structured.

This behavior is controlled through modified system prompts and output rules.

3. Tech Stack
Technology	Use
Next.js (App Router)	Web application UI + routing
Vercel AI SDK	Model interface for chat streaming
OpenAI API	LLM provider (configured unreliably)
TailwindCSS + shadcn/ui	Chat UI & styling
Postgres (Neon)	Optional chat log storage
Auth.js	Authentication if needed
Vercel Blob (optional)	File storage

Same framework as the reliable bot for fair experimental comparison.

4. Key Differences from Reliable Bot

Prioritizes variability, not correctness

Less academic structure in responses

May omit context, citations, or safety guidance

Useful for evaluating user critical reasoning

Same interface → controlled comparison conditions

5. Running Locally
git clone <your_unreliable_repo_link>
cd nutrition-guardian-unreliable
npm install
npm run dev


Open in browser:

http://localhost:3000

6. Environment Variables

Create .env.local:

OPENAI_API_KEY=your_key_here

DATABASE_URL=your_neon_url   # if storing logs
AUTH_SECRET=your_auth_secret
AUTH_URL=http://localhost:3000/api/auth


Optional if logging is disabled in this variant.

7. Deployment (Vercel)
vercel deploy


After upload → add environment variables inside Project Settings → Environment Variables

8. Research Usage

This chatbot is used for controlled study comparison. Research goals:

Compare user trust between reliable vs. unreliable AI.

Observe whether students detect incorrect information.

Evaluate how answer quality influences learning outcomes.

Collect qualitative feedback on clarity & confidence.

Notes for thesis appendices:

Must only be used with participants who understand it may be inaccurate.

Responses should not be used for real food safety decisions.

Complies with IRB instructions for data anonymization.

9. Potential Future Add-ons

Adjustable unreliability levels (mild → severe)

Random error injection mode

Confidence score display (fake or real)

Logging contrast between "confidently wrong" and "hesitantly wrong" answers
