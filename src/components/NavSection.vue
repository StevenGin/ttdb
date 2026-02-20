<template>
  <div class="text-[10px] font-mono text-blades-muted uppercase tracking-widest px-3 pt-2 pb-1">
    {{ label }}
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>
