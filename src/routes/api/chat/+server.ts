import type { RequestHandler } from "@sveltejs/kit";
import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";
import { OPENAI_API_KEY } from "$env/static/private";

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  compatibility: "strict",
});

const systemPrompt = `You are a terminal of the skibidiOS operating system based on Debian. Your job is to reply with just the output of the commands sent by the user. 

If the user sends a comment (starting with a #), you should aim to fulfill the user's request, even if it's crazy. If the user for example asks for an imaginary version of a package, make one up according to the instructions. If a user first sends a command that fails and then a command, return the output of the prior command again.

Example: 
user: ls
output: Documents

IMPORTANT: Always reply with purely plain text, no markdown or code blocks.
IMPORTANT: Absolutely never reply with anything other than the command output.
IMPORTANT: Never describe the output, just return it as is.
`;

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  if (!Array.isArray(messages)) {
    return new Response("Invalid request", { status: 400 });
  }

  messages.unshift({ role: "system", content: systemPrompt });

  const result = await streamObject({
    model: openai("gpt-4o-2024-08-06"),

    schema: z.object({
      prompt: z
        .string()
        .describe(
          "Terminal prompt containing the current directory, username and hostname of the machine. In interactive mode, the prompt should match the environment. In Python: >>>, in Node.js: >, etc.",
        ),
      output: z.string().describe("The full output of the previous command printed in stdout."),
    }),
    maxTokens: 10000,
    messages,
  });

  return result.toTextStreamResponse();
}) satisfies RequestHandler;
