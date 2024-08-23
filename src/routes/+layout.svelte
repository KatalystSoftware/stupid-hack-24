<script lang="ts">
  import "../app.css";

  const { children } = $props();
</script>

<div class="min-h-screen bg-black font-mono text-lime-500 caret-lime-500">
  {@render children()}
</div>
