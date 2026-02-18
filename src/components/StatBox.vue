<template>
  <div class="stat-box">
    <span class="stat-val" :class="accent ? 'text-lancer-accent' : ''">{{ value }}</span>
    <span class="stat-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number | string | null | undefined
  accent?: boolean
}>()
</script>
