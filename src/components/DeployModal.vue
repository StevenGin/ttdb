<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="blades-card p-6 w-full max-w-lg">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl text-blades-gold font-serif">Publish to GitHub Pages</h2>
          <p class="text-blades-muted font-mono text-xs mt-1">Deploy a read-only static site</p>
        </div>
        <button class="text-blades-muted hover:text-blades-text text-xl" @click="$emit('close')">✕</button>
      </div>

      <template v-if="status === 'idle'">
        <div class="space-y-4">
          <div class="bg-blades-bg border border-blades-border p-4 text-xs font-mono space-y-1.5">
            <div class="text-blades-muted">This will:</div>
            <div class="text-blades-text">1. Build a read-only static version of your campaign database</div>
            <div class="text-blades-text">2. Push it to the <span class="text-blades-gold">gh-pages</span> branch on GitHub</div>
            <div class="text-blades-text">3. Your GitHub Pages URL will serve the updated site</div>
          </div>

          <div>
            <label class="blades-label">Your GitHub Pages URL (optional)</label>
            <input v-model="baseUrl" class="blades-input" placeholder="https://yourname.github.io/ttdb/" />
            <div class="text-[10px] text-blades-muted font-mono mt-1">Shown as a share link after deployment.</div>
          </div>

          <div class="text-xs font-mono text-blades-muted border border-blades-border/50 p-3 space-y-1">
            <div class="text-blades-gold-light">Prerequisites:</div>
            <div>· Git configured with push access to origin</div>
            <div>· GitHub Pages enabled on the <span class="text-blades-gold">gh-pages</span> branch</div>
            <div>· Node.js + npm installed locally</div>
          </div>

          <div class="flex gap-2">
            <button class="blades-btn-gold flex-1" @click="status = 'deploying'">↑ Deploy Now</button>
            <button class="blades-btn-ghost" @click="$emit('close')">Cancel</button>
          </div>

          <details class="text-xs font-mono text-blades-muted">
            <summary class="cursor-pointer hover:text-blades-text">Manual instructions</summary>
            <div class="mt-2 bg-blades-bg border border-blades-border p-3 space-y-1">
              <div class="text-blades-gold">npm run build:static</div>
              <div class="text-blades-gold">npm run deploy</div>
            </div>
          </details>
        </div>
      </template>

      <template v-else-if="status === 'deploying'">
        <div class="text-center py-8">
          <div class="text-4xl mb-4 animate-pulse-slow text-blades-gold">†</div>
          <div class="text-blades-gold font-serif text-sm mb-2">Deploying…</div>
          <div class="text-xs font-mono text-blades-muted border border-blades-border p-3 text-left mt-4">
            <div class="text-blades-text mb-1">Run in your terminal:</div>
            <div class="text-blades-gold">npm run build:static && npm run deploy</div>
          </div>
          <button class="blades-btn-ghost text-xs mt-4" @click="status = 'done'">Mark as Done</button>
        </div>
      </template>

      <template v-else>
        <div class="text-center py-8">
          <div class="text-4xl mb-4 text-blades-gold">✓</div>
          <div class="text-blades-gold font-serif text-sm mb-2">Deployment Complete</div>
          <p class="text-blades-muted font-mono text-xs mb-4">Your site should be live on GitHub Pages shortly.</p>
          <div v-if="baseUrl" class="bg-blades-bg border border-blades-gold/30 p-3 mb-4">
            <div class="text-[10px] text-blades-muted font-mono mb-1">Share Link</div>
            <a :href="baseUrl" target="_blank" class="text-blades-gold font-mono text-sm hover:underline">{{ baseUrl }}</a>
          </div>
          <button class="blades-btn-gold text-xs" @click="$emit('close')">Close</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineEmits<{ close: [] }>()
const status = ref<'idle' | 'deploying' | 'done'>('idle')
const baseUrl = ref('')
</script>
