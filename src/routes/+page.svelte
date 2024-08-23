<script lang="ts">
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const previousCommands = [
    { type: "in", text: "echo 'Hello, world!'" },
    { type: "out", text: "Hello, world!" },
    { type: "in", text: "tree" },
    {
      type: "out",
      text: `.
├── src
│   ├── app.css
│   ├── app.html
│   ├── app.ts
│   ├── routes
│   │   ├── $layout.svelte
│   │   ├── $page.svelte
│   │   └── index.svelte
│   └── service-worker.ts
├── static
│   ├── favicon.ico
│   └── robots.txt
└── package.json`,
    },
  ];

  $effect(() => {});
</script>

<main>
  <ul>
    {#each previousCommands as command}
      <li>
        <pre>{command.type === "in" ? "$ " : ""}{command.text}</pre>
      </li>
    {/each}
  </ul>
  <form onsubmit={console.log}>
    <p>
      <span>$</span>
      <input class="border-0 caret-lime-500 focus-visible:outline-0" type="text" />
    </p>
  </form>
</main>
