import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import system from './system';

export async function POST(req: Request) {
  const { messages, model = 'claude', systemPrompt = system } = await req.json();

  let modelConfig;
  let providerOptions;
  let headers;

  if (model === 'groq') {
    modelConfig = groq('llama-3.3-70b-versatile'); // or whichever Groq model you prefer
    providerOptions = undefined;
    headers = undefined;
  } else {
    // Default to Claude
    modelConfig = anthropic('claude-4-sonnet-20250514');
    providerOptions = {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 15000 },
      } satisfies AnthropicProviderOptions,
    };
    headers = {
      'anthropic-beta': 'interleaved-thinking-2025-05-14',
    };
  }

  const result = streamText({
    model: modelConfig,
    system: systemPrompt,
    messages,
    headers,
    providerOptions,
  });

  return result.toDataStreamResponse({
    sendReasoning: model !== 'groq', // Only send reasoning for Claude
  });
}