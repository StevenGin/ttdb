<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    class="flex-shrink-0"
  >
    <g v-for="i in segments" :key="i">
      <path
        :d="segmentPath(i)"
        :fill="i <= filled ? '#c9a84c' : '#17162a'"
        :stroke="'#2e2b45'"
        stroke-width="1.5"
        :class="editable ? 'cursor-pointer' : ''"
        @click="editable && toggle(i)"
      />
    </g>
    <!-- Center circle -->
    <circle :cx="cx" :cy="cy" :r="innerR" fill="#17162a" stroke="#2e2b45" stroke-width="1.5" />
    <text
      :x="cx"
      :y="cy + 1"
      text-anchor="middle"
      dominant-baseline="middle"
      class="font-serif"
      fill="#6a6480"
      :font-size="size * 0.18"
    >{{ filled }}/{{ segments }}</text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ClockSegments } from '@/types/blades'

const props = defineProps<{
  segments: ClockSegments
  filled: number
  editable?: boolean
  size?: number
}>()

const emit = defineEmits<{ update: [filled: number] }>()

const size = computed(() => props.size ?? 60)
const cx = computed(() => size.value / 2)
const cy = computed(() => size.value / 2)
const outerR = computed(() => size.value / 2 - 2)
const innerR = computed(() => outerR.value * 0.42)

function segmentPath(i: number) {
  const total = props.segments
  const startAngle = ((i - 1) / total) * 2 * Math.PI - Math.PI / 2
  const endAngle = (i / total) * 2 * Math.PI - Math.PI / 2
  const gap = 0.04

  const x1 = cx.value + outerR.value * Math.cos(startAngle + gap)
  const y1 = cy.value + outerR.value * Math.sin(startAngle + gap)
  const x2 = cx.value + outerR.value * Math.cos(endAngle - gap)
  const y2 = cy.value + outerR.value * Math.sin(endAngle - gap)
  const x3 = cx.value + innerR.value * Math.cos(endAngle - gap)
  const y3 = cy.value + innerR.value * Math.sin(endAngle - gap)
  const x4 = cx.value + innerR.value * Math.cos(startAngle + gap)
  const y4 = cy.value + innerR.value * Math.sin(startAngle + gap)

  const largeArc = (endAngle - startAngle - gap * 2) > Math.PI ? 1 : 0

  return `M ${x1} ${y1} A ${outerR.value} ${outerR.value} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR.value} ${innerR.value} 0 ${largeArc} 0 ${x4} ${y4} Z`
}

function toggle(i: number) {
  emit('update', props.filled === i ? i - 1 : i)
}
</script>
