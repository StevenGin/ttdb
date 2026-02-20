<template>
  <div>
    <!-- Location row -->
    <div
      class="flex items-start gap-2 py-1.5 px-2 rounded-sm hover:bg-blades-surface/60 group transition-colors cursor-pointer"
      @click="expanded = !expanded"
    >
      <!-- Expand toggle -->
      <span
        class="text-blades-muted text-xs w-4 flex-shrink-0 mt-0.5 select-none transition-transform"
        :class="expanded ? 'rotate-90' : ''"
        v-if="hasChildren"
      >▶</span>
      <span v-else class="w-4 flex-shrink-0" />

      <!-- Type icon / color -->
      <span class="text-xs font-mono flex-shrink-0 mt-0.5" :class="`loc-type-${loc.type}`">
        {{ TYPE_ICONS[loc.type] }}
      </span>

      <!-- Name & type -->
      <div class="flex-1 min-w-0" @click.stop>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-sans font-semibold text-blades-text text-sm">{{ loc.name }}</span>
          <span class="blades-badge-muted text-[10px]">{{ LOCATION_TYPE_LABELS[loc.type] }}</span>
          <span v-if="loc.controlledBy" class="text-[10px] font-mono text-blades-muted">
            ⚑ {{ loc.controlledBy }}
          </span>
        </div>
        <p v-if="loc.description" class="text-blades-muted font-mono text-xs mt-0.5 line-clamp-2">{{ loc.description }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" v-if="!isStatic" @click.stop>
        <button
          class="text-[10px] font-mono text-blades-muted hover:text-blades-gold px-1"
          @click="$emit('edit', loc.id)"
        >Edit</button>
        <button
          class="text-[10px] font-mono text-blades-muted hover:text-blades-gold px-1"
          @click="$emit('add-child', loc.id)"
        >+ Child</button>
        <button
          class="text-[10px] font-mono text-blades-muted hover:text-blades-red-light px-1"
          @click="$emit('delete', loc.id)"
        >✕</button>
      </div>
    </div>

    <!-- Children (recursive) -->
    <div v-if="expanded && hasChildren" class="ml-6 border-l border-blades-border/40 pl-2">
      <LocationNode
        v-for="child in children"
        :key="child.id"
        :loc="child"
        :all-locations="allLocations"
        :is-static="isStatic"
        @edit="$emit('edit', $event)"
        @add-child="$emit('add-child', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Location } from '@/types/blades'
import { LOCATION_TYPE_LABELS } from '@/types/blades'

const props = defineProps<{
  loc: Location
  allLocations: Location[]
  isStatic: boolean
}>()

defineEmits<{
  edit: [id: string]
  'add-child': [parentId: string]
  delete: [id: string]
}>()

const expanded = ref(true)

const children = computed(() =>
  props.allLocations
    .filter(l => l.parentId === props.loc.id)
    .sort((a, b) => a.name.localeCompare(b.name))
)

const hasChildren = computed(() => children.value.length > 0)

const TYPE_ICONS: Record<string, string> = {
  world: '🌍', city: '🏙', district: '🏘', area: '📍',
  site: '🏛', room: '🚪', other: '◆',
}
</script>
