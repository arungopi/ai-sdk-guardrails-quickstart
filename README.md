# ai-sdk-guardrails-quickstart
A quickstart on ai-sdk-guardrails with Next.js

The model obtained from guarded-model.ts through getGuardedModel(modelName: string) or
addGuardRailsToModel(modelName: string) can be used with ai-sdk functions like streamText().
The model throws exception when guardrails error occurs, that can be checked by isGuardrailsError function in ai-sdk-guardrails.

The npm package ai-sdk-guardrails@5.3.0 support only Languagemodelv2 and this can cause issues with usechat of Vercel AI SDK.