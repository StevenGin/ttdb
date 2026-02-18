<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="lancer-card p-6 w-full max-w-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl text-lancer-accent font-display font-bold">PUBLISH TO GITHUB PAGES</h2>
          <p class="text-lancer-muted font-mono text-xs mt-1">Deploy a read-only static site</p>
        </div>
        <button class="text-lancer-muted hover:text-lancer-text text-xl" @click="$emit('close')">✕</button>
      </div>

      <!-- Status: idle -->
      <template v-if="status === 'idle'">
        <div class="space-y-4">
          <div class="bg-lancer-bg border border-lancer-border p-4 text-xs font-mono space-y-2">
            <div class="text-lancer-muted">This will:</div>
            <ul class="space-y-1 ml-2">
              <li class="text-lancer-text">1. Build a read-only static version of your site</li>
              <li class="text-lancer-text">2. Push it to the <code class="text-lancer-accent">gh-pages</code> branch</li>
              <li class="text-lancer-text">3. Your GitHub Pages URL will serve the updated site</li>
            </ul>
          </div>

          <div>
            <label class="lancer-label">GitHub Pages Base URL (optional)</label>
            <input
              v-model="baseUrl"
              class="lancer-input"
              placeholder="e.g. https://yourname.github.io/ttdb/"
            />
            <div class="text-[10px] text-lancer-muted font-mono mt-1">
              Used for the share link after deployment. Leave blank to skip.
            </div>
          </div>

          <div class="text-xs font-mono text-lancer-muted border border-lancer-border/50 p-3 space-y-1">
            <div class="text-lancer-yellow">⚠ Prerequisites:</div>
            <div>· Git installed and configured with push access to origin</div>
            <div>· GitHub Pages enabled on <code class="text-lancer-accent">gh-pages</code> branch in repo settings</div>
            <div>· Node.js and npm installed locally</div>
          </div>

          <div class="flex gap-2">
            <button class="lancer-btn-primary flex-1" @click="deploy">
              ↑ Deploy Now
            </button>
            <button class="lancer-btn-ghost" @click="$emit('close')">Cancel</button>
          </div>

          <!-- Manual instructions fallback -->
          <details class="text-xs font-mono text-lancer-muted">
            <summary class="cursor-pointer hover:text-lancer-text">Manual deployment instructions</summary>
            <div class="mt-2 bg-lancer-bg border border-lancer-border p-3 space-y-1">
              <div class="text-lancer-muted/70">Run these commands from the project root:</div>
              <code class="block text-lancer-accent mt-2">npm run build:static</code>
              <code class="block text-lancer-accent">npm run deploy</code>
            </div>
          </details>
        </div>
      </template>

      <!-- Status: deploying -->
      <template v-else-if="status === 'deploying'">
        <div class="text-center py-8">
          <div class="text-4xl mb-4 animate-pulse-slow">⚙</div>
          <div class="text-lancer-accent font-mono text-sm mb-2">Deploying...</div>
          <div class="text-lancer-muted font-mono text-xs">This happens via <code>npm run deploy</code></div>
          <div class="mt-4 text-xs font-mono text-lancer-muted border border-lancer-border p-3 text-left">
            <div class="text-lancer-text mb-2">Run in your terminal:</div>
            <code class="text-lancer-accent block">npm run build:static && npm run deploy</code>
          </div>
          <button class="lancer-btn-ghost text-xs mt-4" @click="status = 'done'">Mark as Done</button>
        </div>
      </template>

      <!-- Status: done -->
      <template v-else-if="status === 'done'">
        <div class="text-center py-8">
          <div class="text-4xl mb-4 text-lancer-accent">✓</div>
          <div class="text-lancer-accent font-mono text-sm mb-2">Deployment Complete</div>
          <p class="text-lancer-muted font-mono text-xs mb-4">
            Your read-only site should be live on GitHub Pages shortly.
          </p>
          <div v-if="baseUrl" class="bg-lancer-bg border border-lancer-accent/30 p-3 mb-4">
            <div class="text-[10px] text-lancer-muted font-mono mb-1">SHARE LINK</div>
            <a :href="baseUrl" target="_blank" class="text-lancer-accent font-mono text-sm hover:underline">{{ baseUrl }}</a>
          </div>
          <button class="lancer-btn-primary text-xs" @click="$emit('close')">Close</button>
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

function deploy() {
  // In a real local app, this would trigger an IPC call to run the deploy script.
  // Since we run in a browser context, we show the terminal commands instead.
  status.value = 'deploying'
}
</script>
