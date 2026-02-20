<!-- Reusable right-side slide-over drawer -->
<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-50 flex" @keydown.esc="$emit('close')">
        <!-- Scrim -->
        <div
          class="flex-1 bg-black/50 backdrop-blur-sm"
          @click="$emit('close')"
        />
        <!-- Panel -->
        <div
          class="w-[520px] max-w-full bg-blades-surface border-l border-blades-border
                 h-full overflow-y-auto flex flex-col shadow-2xl"
          role="dialog"
          :aria-label="title"
        >
          <!-- Header slot -->
          <div class="flex items-center justify-between p-4 border-b border-blades-border flex-shrink-0">
            <slot name="header">
              <h2 class="text-lg font-serif text-blades-text">{{ title }}</h2>
            </slot>
            <button
              class="text-blades-muted hover:text-blades-text text-lg ml-4 flex-shrink-0 leading-none"
              @click="$emit('close')"
              aria-label="Close"
            >✕</button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto">
            <slot />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="flex-shrink-0 border-t border-blades-border p-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()
defineEmits<{ close: [] }>()
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
/* Panel slide */
.drawer-enter-from :deep([role="dialog"]),
.drawer-leave-to :deep([role="dialog"]) {
  transform: translateX(100%);
}
.drawer-enter-to :deep([role="dialog"]),
.drawer-leave-from :deep([role="dialog"]) {
  transform: translateX(0);
}
:deep([role="dialog"]) {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
