import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { TextDecoder } from 'util';

const openai = new OpenAI({
  apiKey: process.env.X_AI_API_KEY || '',
  baseURL: 'https://api.x.ai/v1'
});


export async function POST(req: Request) {
  try {
    const apiKey = process.env.X_AI_API_KEY;
    if (!apiKey) {
      throw new Error('X.AI API key not configured');
    }
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta', // Update the model name as per the documentation
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    // Process the streaming response
    const decoder = new TextDecoder();
    const reader = response.body!.getReader();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);

      // Split the chunk into individual lines
      const lines = chunk.split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '') continue;

        if (trimmedLine.startsWith('data:')) {
          const dataStr = trimmedLine.substring(5).trim();
          if (dataStr === '[DONE]') {
            break;
          } else {
            try {
              const data = JSON.parse(dataStr);
              const delta = data.choices[0].delta;
              if (delta && delta.content) {
                result += delta.content;
              }
            } catch (e) {
              console.error('Failed to parse JSON:', e);
            }
          }
        }
      }
    }

    // Return the aggregated result
    return new Response(result, { status: 200, headers: { 'Content-Type': 'text/plain' } });

  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}