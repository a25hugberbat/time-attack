<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '@/components/ResultsTable.vue'

const tecles = ['A', 'S', 'D', 'F']

const tempsObjectiu = {
  A: 2,
  S: 4,
  D: 5,
  F: 7
}

const jugant = ref(false)
const resultats = ref([])

let tempsInici = 0

function rebreTecla(tecla) {

  let tempsArribada=performance.now()
  let diferencia=(tempsArribada - tempsInici)/1000

  for (let index = 0; index < resultats.value.length; index++) {
    if(resultats.value[index].tecla===tecla){
      console.log("tecla repetida");
      return;
    }
  }

  let nouResultat ={
          "tecla" : tecla,
          "objectiu" : tempsObjectiu[tecla],
          "tempsReal" : diferencia,
          "error" : tempsObjectiu[tecla]-diferencia
  }
  console.log(nouResultat)

  resultats.value.push(nouResultat)

  if (resultats.value.length==tecles.length){
    jugant.value=false
  }
}

function iniciarPartida() {
  jugant.value = true
  tempsInici = performance.now()
  console.log("Inici de partida" + tempsInici)
  resultats.value = []
}

// event es lo que recive (keydown) y itera con lo que registra keydown, que es la key (la tecla que apreta), type (el evento) y repeat (si está mantenida)
function gestionarTeclat(event) { 
  if (event.repeat) return // para que no registre mas si esta manteniendo la tecla
  if (!jugant.value) return // solo lo registra si "jugant" esta en true
  const tecla = event.key.toUpperCase() // transforma la tecla apretada en mayusculas para comprarla en el if
  if (tecles.includes(tecla)) { // comprueba que la tecla esté en el array de 4 que tenemos
    rebreTecla(tecla) // aplica la funcion de rebreTecla para la tecla que ha registrado el teclado 
  }
}

onMounted(() => {
  // cuando se inicia todo, lee el teclado y activa el evento, ejecuta la función gestionarTeclat
  window.addEventListener('keydown', gestionarTeclat)
})

onUnmounted(() => {
  // mata el evento cuando se desmonta
  window.removeEventListener('keydown', gestionarTeclat)
})

</script>

<template>
  <main class="joc">
    <header>
      <p class="etiqueta">Time Attack</p>
      <h1>Joc del temps</h1>
      <p class="instruccions">
        Prem <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> <kbd>F</kbd> als
        <strong>2, 4, 5 i 7</strong> segons. No hi ha cronòmetre!
      </p>
    </header>
 
    <div class="objectius">
      <div v-for="tecla in tecles" :key="tecla" class="objectiu">
        {{ tempsObjectiu[tecla] }}s
      </div>
    </div>
 
    <KeyPad
      :tecles="tecles"
      :bloquejat="!jugant"
      @premuda="rebreTecla"
    />
 
    <button class="boto-comencar" @click="iniciarPartida" :disabled="jugant">
      {{ jugant ? 'Comptant al teu cap…' : 'Començar' }}
    </button>
 
    <ResultsTable
      v-if="!jugant && resultats.length === tecles.length"
      :resultats="resultats"
    />
 
  </main>
</template>
 
<style scoped>
.joc {
  width: 100%;
  max-width: 460px;
  background: var(--fons-targeta);
  border: 1px solid var(--vora);
  border-radius: 24px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
}
 
header {
  text-align: center;
}
 
.etiqueta {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 6px;
}
 
h1 {
  font-size: clamp(1.8rem, 7vw, 2.4rem);
  line-height: 1.1;
  margin-bottom: 12px;
}
 
.instruccions {
  color: var(--text-suau);
  line-height: 1.6;
}
 
.instruccions strong {
  color: var(--text);
}
 
kbd {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  padding: 1px 6px;
  border-radius: 5px;
  border: 1px solid var(--vora);
  background: var(--tecla);
  color: var(--text);
  box-shadow: 0 2px 0 var(--tecla-ombra);
}
 
.objectius {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: -12px;
}
 
.objectiu {
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-suau);
}
 
.boto-comencar {
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: var(--fons);
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s, filter 0.15s;
}
 
.boto-comencar:hover:not(:disabled) {
  filter: brightness(1.1);
}
 
.boto-comencar:active:not(:disabled) {
  transform: scale(0.98);
}
 
.boto-comencar:disabled {
  background: var(--tecla);
  color: var(--text-suau);
  cursor: default;
  animation: pols 1.6s ease-in-out infinite;
}
 
@keyframes pols {
  50% { opacity: 0.6; }
}
</style>
