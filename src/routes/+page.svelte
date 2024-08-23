<script lang="ts">
  import { useChat } from "@ai-sdk/svelte";

  const { input, handleSubmit, messages } = useChat();
</script>

<main>
  <ul>
    {#each $messages as message}
      <li>
        <pre>{message.role === "user" ? "$ " : ""}{message.content}</pre>
      </li>
    {/each}
  </ul>
  <form onsubmit={handleSubmit}>
    <p>
      <span>$</span>
      <input class="w-[80ch] border-0 focus-visible:outline-0" type="text" bind:value={$input} />
    </p>
  </form>
</main>
