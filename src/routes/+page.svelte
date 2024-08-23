<script lang="ts">
  import { useChat } from "@ai-sdk/svelte";
  import { parse } from "partial-json";

  const { input, handleSubmit, messages, isLoading } = useChat({ streamProtocol: "text" });

  $: console.log($messages);
  $: lastAssistantMessage = $messages.findLast((m) => m.role === "assistant");
  $: nextPrompt = parse(lastAssistantMessage?.content ?? "null")?.prompt ?? "$";
  $: console.log($isLoading);
</script>

<main>
  <ul>
    {#each $messages.entries() as [index, message] (index)}
      {@const messageContent =
        message.role === "assistant" ? parse(message.content)?.output : message.content}
      {@const previousAssistantMessage = parse(
        $messages.slice(0, index).findLast((m) => m.role === "assistant")?.content ?? "null",
      )}
      <li>
        <pre>{message.role === "user"
            ? (previousAssistantMessage?.prompt ?? "$") + " "
            : ""}{messageContent}</pre>
      </li>
    {/each}
  </ul>
  {#if !$isLoading}
    <form onsubmit={handleSubmit}>
      <p>
        <span>{nextPrompt}</span>
        <input class="w-[80ch] border-0 focus-visible:outline-0" type="text" bind:value={$input} />
      </p>
    </form>
  {/if}
</main>
