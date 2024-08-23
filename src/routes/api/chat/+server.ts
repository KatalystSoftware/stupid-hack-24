import type { RequestHandler } from "@sveltejs/kit";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { OPENAI_API_KEY } from "$env/static/private";

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  compatibility: "strict",
});

const systemPrompt = `You are a terminal of the SkibidiOS operating system based on Debian. Your job is to reply with just the output of the commands sent by the user. 

If the user sends a comment (starting with a #), you should aim to fulfill the user's request, even if it's crazy. If the user for example asks for an imaginary version of a package, make one up according to the instructions. If a user first sends a command that fails and then a command, return the output of the prior command again.

End your message with skibidi@rizz-PC:~$ on a new line so I can enter the next command. Make sure if is always after a new line and not on the same line as the rest of the output. It should contain the directory if needed, for example skibidi@rizz-PC:~/Documents$. Respond first with just the line for a new command. The last row of the output will always be used for the input line of the terminal, so if for example in a Node REPL environment, replace it with one similar to the Node REPL one.

Example: 
user: ls
output: Documents

IMPORTANT: Always reply with purely plain text, no markdown or code blocks.
IMPORTANT: Absolutely never reply with anything other than the command output.
`;

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  if (!Array.isArray(messages)) {
    return new Response("Invalid request", { status: 400 });
  }

  messages.unshift({ role: "system", content: systemPrompt });

  const result = await streamText({
    model: openai("gpt-4o-2024-08-06"),
    messages,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;
