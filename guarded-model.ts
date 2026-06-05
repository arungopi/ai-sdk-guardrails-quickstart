/**
 * @file guarded-model.ts
 * @description  Creates a guarded model with ai-sdk-guardrails
 * @copyright Copyright (c) 2026 Arun Gopi
 * @author Arun Gopi 
 * @module 
 * @remarks 
 * @see 
 * 
 */

import { wrapLanguageModel } from 'ai';
import { ollama } from 'ai-sdk-ollama';
import {
    withGuardrails,
    createGuardrails,
    promptInjectionDetector,
    toxicityDetector,
    hallucinationDetector,
} from 'ai-sdk-guardrails';
import type { LanguageModelV3Middleware } from '@ai-sdk/provider';

/**
 * This module defines the guarded model for the VM provisioning assistant. 
 * It incorporates guard rails to ensure that all interactions with the LLM
 * are secure and free from malicious content. The guarded model is
 * designed to prevent prompt injections, privilege escalation
 * attempts, and other forms of malicious requests that could
 * compromise the security of the infrastructure provisioning system.
 * The guard is added through middleware.
 * @param modelName 
 * @returns 
 * @see https://www.npmjs.com/package/ai-sdk-guardrails for more details on how to implement guard rails using ai-sdk-guardrail framework.

 */
export async function getGuardedModel(modelName: string) {
    const guardrails = withGuardrails(ollama(modelName, /*{structuredOutputs: false}*/), {
        inputGuardrails: [promptInjectionDetector(), toxicityDetector()/*Detect toxic content*/],
        outputGuardrails: [hallucinationDetector()/*Detect uncertain claim*/],
        throwOnBlocked: true, // Throw an error if any guardrail is violated
    });//as unknown as LanguageModelV3Middleware;
/*
    const guardrails = createGuardrails({
        inputGuardrails: [promptInjectionDetector(), toxicityDetector()],
        outputGuardrails: [hallucinationDetector()],
        throwOnBlocked: true, // Throw an error if any guardrail is violated
    });//as unknown as LanguageModelV3Middleware;
*/

    /*
    // Create a small logger middleware to see exactly what Ollama is receiving
    const loggingMiddleware: LanguageModelV3Middleware = {
        specificationVersion: 'v3',
        transformParams: async ({ params }) => {
            console.log("DETECTOR INPUT RECEIVED:", JSON.stringify(params.prompt, null, 2));
            return params;
        }
    };
    */

    //const wrappedModel = guardrails(ollama(modelName, /*{structuredOutputs: false}*/));
    
    //const wrappedModel = wrapLanguageModel({ model: ollama(modelName), middleware: [/*loggingMiddleware,*/guardrails] });

    return guardrails;//wrappedModel;
}


/**
 * Checks the user messages with ai-sdk-guardrail framework.
 * @see https://www.npmjs.com/package/ai-sdk-guardrails for more details on how to implement guard rails using ai-sdk-guardrail framework.
 * @param messages 
 * @returns Boolean
 */
export async function addGuardRailsToModel(modelName: string) {
    const guardRailedModel = withGuardrails(ollama(modelName, /*{structuredOutputs: false}*/), {
        inputGuardrails: [promptInjectionDetector()],
        throwOnBlocked: true, // Throw errors instead of silent blocking
    });

    //const guardRailedModel = ollama(modelName, {structuredOutputs: true});

    return guardRailedModel;;
}