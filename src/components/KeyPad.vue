<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  tecles: Array,
  bloquejat: Boolean
})

const emit = defineEmits(['premuda'])

// ---- Només per a l'estil: saber quina tecla física està premuda ----
// (no crida rebreTecla, això ja ho fa GameBoardView)
const teclaPremuda = ref(null)

function marcarTecla(event) {
  teclaPremuda.value = event.key.toUpperCase()
}

function desmarcarTecla() {
  teclaPremuda.value = null
}

onMounted(() => {
  window.addEventListener('keydown', marcarTecla)
  window.addEventListener('keyup', desmarcarTecla)
})

onUnmounted(() => {
  window.removeEventListener('keydown', marcarTecla)
  window.removeEventListener('keyup', desmarcarTecla)
})
</script>

<template>
  <div class="teclat">
    <button
      v-for="tecla in tecles"
      :key="tecla"
      :disabled="bloquejat"
      :class="{ premuda: teclaPremuda === tecla && !bloquejat }"
      class="tecla"
      @click="emit('premuda', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>

<style scoped>
.teclat {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.tecla {
  aspect-ratio: 1;
  border: 1px solid var(--vora);
  border-radius: 14px;
  background: linear-gradient(180deg, #353051 0%, var(--tecla) 100%);
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1.4rem, 6vw, 2rem);
  font-weight: 700;
  cursor: pointer;
  /* L'ombra de sota fa que sembli una tecla "alta" */
  box-shadow: 0 6px 0 var(--tecla-ombra), 0 10px 18px rgba(0, 0, 0, 0.35);
  transition: transform 0.06s, box-shadow 0.06s, background 0.15s, color 0.15s;
  user-select: none;
}

.tecla:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

/* Quan la prems (amb el ratolí o amb el teclat) baixa i s'il·lumina */
.tecla:active:not(:disabled),
.tecla.premuda {
  transform: translateY(6px);
  box-shadow: 0 0 0 var(--tecla-ombra), 0 0 24px rgba(255, 181, 71, 0.55);
  background: linear-gradient(180deg, var(--accent) 0%, var(--accent-fosc) 100%);
  border-color: var(--accent);
  color: var(--fons);
}

.tecla:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.tecla:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
</style>