<template>
  <div class="relative group">
    <!-- Banner display -->
    <div
      class="banner-container w-full overflow-hidden rounded-sm border border-blades-border"
      :class="square ? 'aspect-square' : ''"
      :style="square ? {} : { height: height + 'px' }"
    >
      <img
        v-if="modelValue"
        :src="modelValue"
        class="w-full h-full object-cover"
        :alt="altText"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center banner-placeholder"
      >
        <span class="text-blades-muted font-mono text-xs opacity-50">No banner</span>
      </div>
    </div>

    <!-- Controls overlay (edit mode only) -->
    <div
      v-if="!isStatic"
      class="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-sm"
    >
      <!-- Upload -->
      <label class="blades-btn-ghost text-xs cursor-pointer py-1 px-3">
        Upload
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileUpload"
        />
      </label>

      <!-- AI Generate -->
      <button
        class="banner-ai-btn text-xs py-1 px-3"
        :class="{ 'opacity-50 cursor-wait': generating }"
        :disabled="generating"
        @click="generateImage"
        title="Generate in Studio Ghibli / Frieren / Dungeonmeshi style"
      >
        {{ generating ? 'Generating...' : '✦ AI Image' }}
      </button>

      <!-- Clear -->
      <button
        v-if="modelValue"
        class="blades-btn-danger text-xs py-1 px-3"
        @click="$emit('update:modelValue', '')"
      >
        Clear
      </button>
    </div>

    <!-- Generating overlay -->
    <div
      v-if="generating"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-sm"
    >
      <div class="text-blades-gold font-mono text-xs mb-2 animate-pulse">Painting the scene...</div>
      <div class="text-blades-muted font-mono text-[10px] text-center px-4">{{ generatingPrompt }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue?: string
  altText?: string
  subject?: string      // entity name for the AI prompt
  description?: string  // short description for richer prompt
  height?: number
  square?: boolean      // use aspect-ratio:1 instead of fixed height
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const height = props.height ?? 240

declare const __STATIC_MODE__: boolean
const isStatic = __STATIC_MODE__

const generating = ref(false)
const generatingPrompt = ref('')

// ── File upload ─────────────────────────────────────────────────────────────
function onFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:modelValue', e.target?.result as string)
  }
  reader.readAsDataURL(file)
}

// ── AI generation via Pollinations.ai ────────────────────────────────────────
async function generateImage() {
  if (generating.value) return

  const subject = props.subject || 'fantasy location'
  const desc = props.description ? `. ${props.description.slice(0, 120)}` : ''
  const stylePrompt = 'studio ghibli anime style, Frieren Beyond Journey\'s End aesthetic, Delicious in Dungeon dungeonmeshi art style, soft watercolor illustration, warm earthy tones, detailed background, cozy fantasy atmosphere, masterpiece'
  const fullPrompt = `${subject}${desc}, ${stylePrompt}`
  generatingPrompt.value = fullPrompt.slice(0, 80) + '...'

  generating.value = true
  try {
    const encoded = encodeURIComponent(fullPrompt)
    // Pollinations AI — free, no API key required
    const seed = Math.floor(Math.random() * 9999)
    const dims = props.square ? 'width=768&height=768' : `width=1280&height=${height * 2}`
    const url = `https://image.pollinations.ai/prompt/${encoded}?${dims}&nologo=true&seed=${seed}&model=flux`
    // Prefetch to confirm it loaded then set
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Image failed to load'))
      img.src = url
    })
    emit('update:modelValue', url)
  } catch (err) {
    console.warn('AI image generation failed:', err)
    alert('Image generation failed. Check your connection and try again.')
  } finally {
    generating.value = false
    generatingPrompt.value = ''
  }
}
</script>

<style scoped>
.banner-placeholder {
  background: repeating-linear-gradient(
    -45deg,
    var(--tw-color-blades-surface, #141e1b) 0px,
    var(--tw-color-blades-surface, #141e1b) 10px,
    transparent 10px,
    transparent 20px
  );
  background-color: #141e1b;
}
.banner-ai-btn {
  @apply font-mono border border-amber-700 text-amber-400 bg-amber-900/20
         hover:bg-amber-800/40 hover:text-amber-300 rounded-sm cursor-pointer
         transition-all duration-150;
  font-size: 0.7rem;
  padding: 0.2rem 0.75rem;
}
</style>
