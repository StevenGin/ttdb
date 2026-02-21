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
      <div class="text-blades-gold font-mono text-xs mb-2 animate-pulse">
        {{ retrying ? 'Retrying...' : 'Painting the scene...' }}
      </div>
      <div class="text-blades-muted font-mono text-[10px] text-center px-4">{{ generatingPrompt }}</div>
    </div>

    <!-- Error overlay -->
    <div
      v-if="genError"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-sm"
    >
      <div class="text-red-400 font-mono text-xs mb-2">Generation failed</div>
      <div class="text-blades-muted font-mono text-[10px] text-center px-4 mb-3">Check connection and try again</div>
      <button class="blades-btn-ghost text-[10px] py-1 px-3" @click="genError = false">Dismiss</button>
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
const retrying = ref(false)
const genError = ref(false)

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
function makeUrl(encoded: string, seed: number) {
  const dims = props.square ? 'width=768&height=768' : `width=1280&height=${height * 2}`
  return `https://image.pollinations.ai/prompt/${encoded}?${dims}&nologo=true&seed=${seed}&model=flux`
}

// Fetch image via fetch() → blob → data URL.
// Gives real HTTP status codes; embeds the image so it stays even if the
// Pollinations URL eventually changes.
async function fetchAsDataUrl(url: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 90_000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('FileReader failed'))
      reader.readAsDataURL(blob)
    })
  } finally {
    clearTimeout(timer)
  }
}

async function generateImage() {
  if (generating.value) return
  genError.value = false

  const subject = props.subject || 'fantasy location'
  const desc = props.description ? `. ${props.description.slice(0, 120)}` : ''
  const stylePrompt = 'Frieren Beyond Journey\'s End anime art style, studio ghibli, soft watercolor illustration, muted cool tones, twilight atmosphere, ancient fantasy world, moonlit palette, misty distant landscape, intricate details, masterpiece quality'
  const fullPrompt = `${subject}${desc}, ${stylePrompt}`
  generatingPrompt.value = fullPrompt.slice(0, 80) + '...'

  generating.value = true
  retrying.value = false

  const encoded = encodeURIComponent(fullPrompt)

  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt === 1) retrying.value = true
    const seed = Math.floor(Math.random() * 99_999)
    const url = makeUrl(encoded, seed)
    try {
      const dataUrl = await fetchAsDataUrl(url)
      emit('update:modelValue', dataUrl)
      generating.value = false
      retrying.value = false
      generatingPrompt.value = ''
      return
    } catch (err) {
      console.warn(`AI generation attempt ${attempt + 1} failed:`, err)
      // loop for one retry, then fall through to error state
    }
  }

  genError.value = true
  generating.value = false
  retrying.value = false
  generatingPrompt.value = ''
}
</script>

<style scoped>
.banner-placeholder {
  background: repeating-linear-gradient(
    -45deg,
    #1f2338 0px,
    #1f2338 10px,
    transparent 10px,
    transparent 20px
  );
  background-color: #1f2338;
}
.banner-ai-btn {
  @apply font-mono border border-amber-700 text-amber-400 bg-amber-900/20
         hover:bg-amber-800/40 hover:text-amber-300 rounded-sm cursor-pointer
         transition-all duration-150;
  font-size: 0.7rem;
  padding: 0.2rem 0.75rem;
}
</style>
