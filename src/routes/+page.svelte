<script lang="ts">
  import { onMount } from "svelte";
  import { useChat } from "@ai-sdk/svelte";
  import { parse } from "partial-json";

  const { input, handleSubmit, messages, isLoading, setMessages } = useChat({
    streamProtocol: "text",
  });

  const defautPrompt = "user@skibidiOS:~$";
  $: lastAssistantMessage = $messages.findLast((m) => m.role === "assistant");
  $: nextPrompt = parse(lastAssistantMessage?.content ?? "null")?.prompt ?? defautPrompt;

  function outOfMoneyHandleSubmit() {
    setMessages([
      ...$messages,
      { id: crypto.randomUUID(), role: "user", content: $input },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: JSON.stringify({
          prompt: nextPrompt,
          output: `We ran out of money, sorry!

Check the project out on GitHub and play with your own moneys
https://github.com/katalystSoftware/stupid-hack-24`,
        }),
      },
    ]);
    $input = "";
  }

  $: console.log($messages);

  onMount(() => {
    const observer = new ResizeObserver(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  });

  onMount(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const input = document.querySelector("input");
      if (input) input.focus();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });
</script>

<main>
  <ul>
    {#each $messages.entries() as [index, message] (message.id)}
      {@const messageContent =
        message.role === "assistant" ? parse(message.content)?.output : message.content}
      {@const previousAssistantMessage = parse(
        $messages.slice(0, index).findLast((m) => m.role === "assistant")?.content ?? "null",
      )}
      <li>
        <pre>{message.role === "user"
            ? (previousAssistantMessage?.prompt ?? defautPrompt) + " "
            : ""}{messageContent}</pre>
      </li>
    {/each}
  </ul>
  {#if !$isLoading}
    <form onsubmit={outOfMoneyHandleSubmit}>
      <p>
        <span>{nextPrompt}</span>
        <input class="w-[80ch] border-0 focus-visible:outline-0" type="text" bind:value={$input} />
      </p>
    </form>
  {/if}
</main>
