<template>
  <div>
    <!-- Location row -->
    <div
      class="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-blades-surface/60 group transition-colors"
    >
      <!-- Expand toggle -->
      <button
        class="text-blades-muted text-xs w-4 flex-shrink-0 mt-0.5 select-none transition-transform hover:text-blades-text"
        :class="expanded ? 'rotate-90' : ''"
        v-if="hasChildren"
        @click.stop="expanded = !expanded"
      >▶</button>
      <span v-else class="w-4 flex-shrink-0" />

      <!-- Type icon -->
      <span class="text-xs font-mono flex-shrink-0 mt-0.5" :class="`loc-type-${loc.type}`">
        {{ TYPE_ICONS[loc.type] }}
      </span>

      <!-- Name & type — clicking opens drawer -->
      <div class="flex-1 min-w-0 cursor-pointer" @click="$emit('view', loc.id)">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-sans font-semibold text-blades-text text-sm group-hover:text-blades-gold transition-colors">{{ loc.name }}</span>
          <span class="blades-badge-muted text-[10px]">{{ LOCATION_TYPE_LABELS[loc.type] }}</span>
          <span v-if="controlledByName" class="text-[10px] font-mono text-blades-muted">⚑ {{ controlledByName }}</span>
        </div>
        <p v-if="loc.description" class="text-blades-muted font-mono text-xs mt-0.5 line-clamp-1">{{ loc.description }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" v-if="!isStatic" @click.stop>
        <button class="text-[10px] font-mono text-blades-muted hover:text-blades-gold px-1" @click="$emit('add-child', loc.id)">+ Child</button>
        <button class="text-[10px] font-mono text-blades-muted hover:text-blades-red-light px-1" @click="$emit('delete', loc.id)">✕</button>
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
        :faction-map="factionMap"
        @view="$emit('view', $event)"
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
  factionMap?: Record<string, string>  // factionId → name
}>()

defineEmits<{
  view: [id: string]
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

const controlledByName = computed(() =>
  props.loc.controlledBy && props.factionMap
    ? (props.factionMap[props.loc.controlledBy] ?? '')
    : ''
)

const TYPE_ICONS: Record<string, string> = {
  world: '🌍', city: '🏙', district: '🏘', area: '📍',
  site: '🏛', room: '🚪', other: '◆',
}
</script>
