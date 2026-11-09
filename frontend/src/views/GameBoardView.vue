<script setup>
import { socket } from '@/services/socket'
import { ref, onMounted, onUnmounted } from 'vue'
import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '@/components/ResultsTable.vue'
import { useGameStore } from '@/stores/game.js'
import ScoreBoard from '@/components/ScoreBoard.vue'
import RoomForm from '@/components/RoomForm.vue'

function connectat() {
  console.log('Connectat al servidor!', socket.id)
}

const store = useGameStore()

const nom = ref('')

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

function rebreClassificacio(dades) {
  console.log('Classificació rebuda:', dades)

  store.actualitzarClassificacio(dades)
}

function rebreTecla(tecla) {

  let tempsArribada = performance.now()
  let diferencia = (tempsArribada - tempsInici) / 1000
  // Si la tecla ya se ha pulsado en esta partida, no hacemos nada
  for (let index = 0; index < resultats.value.length; index++) {
    if (resultats.value[index].tecla === tecla) {
      console.log("tecla repetida");
      return;
    }
  }
  // Guardamos el resultado de esta tecla
  let nouResultat = {
    "tecla": tecla,
    "objectiu": tempsObjectiu[tecla],
    "tempsReal": diferencia,
    "error": tempsObjectiu[tecla] - diferencia
  }

  console.log(nouResultat)

  resultats.value.push(nouResultat)

  // Si ya tenemos las 4 teclas, se acaba la partida y la guardamos en Pinia
  if (resultats.value.length === tecles.length) {
    jugant.value = false

    // Calculem l'error total
    let errorTotal = 0
    for (let index = 0; index < resultats.value.length; index++) {
      const element = resultats.value[index];
      errorTotal = errorTotal + Math.abs(element.error);
    }

    const errorFinal = Number(errorTotal.toFixed(2))

    // Guardem la partida al nostre Pinia
    store.guardarPartida(errorFinal)

    // Enviem el resultat al servidor
    socket.emit('resultat', {
      nom: store.nomJugador,
      errorTotal: errorFinal
    })
  }
}

function rebreEstat(dades) {
  store.actualitzarSala(dades)
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

function entrar() {
  if (nom.value.trim() === '') return

  store.guardarNom(nom.value.trim())

}

onMounted(() => {
  // cuando se inicia todo, lee el teclado y activa el evento, ejecuta la función gestionarTeclat
  window.addEventListener('keydown', gestionarTeclat)

  socket.on('connect', connectat)// escucha el evento de conexión
  socket.on('classificacio', rebreClassificacio) // quan arribi un missatge classificacio executa la funció rebreClassificacio() i pasa les dades rebudes

  socket.connect() // inicia la conexión
})

onUnmounted(() => {
  // mata el evento cuando se desmonta
  window.removeEventListener('keydown', gestionarTeclat)

  socket.off('connect', connectat) // elimina el listener
  socket.off('classificacio', rebreClassificacio)

  socket.disconnect() // cierra la conexión
})

</script>

<template>

  <div v-if="!store.nomJugador" class="joc benvinguda">
    <header>
      <p class="etiqueta">Time Attack</p>
      <h1>Benvingut a TIME ATTACK!</h1>
      <p class="instruccions">Escriu el teu nom per començar a jugar.</p>
    </header>

    <input v-model="nom" class="camp-nom" placeholder="Introdueix el teu nom" @keyup.enter="entrar" />

    <button class="boto-comencar" @click="entrar">
      Entrar al joc
    </button>
  </div>

  <main v-else class="joc">

    <header>
      <p class="salutacio">Hola, <strong>{{ store.nomJugador }}</strong>!</p>
      <h2>Sala: {{ store.roomCode }}</h2>
      <p>Ronda: {{ store.round }}</p>
      <ul>
        <li v-for="jugador in store.players" :key="jugador.id">
          {{ jugador.nickname }}
        </li>
      </ul>
      <p class="etiqueta">Time Attack</p>
      <h1>Joc del temps</h1>

      <ScoreBoard />

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

    <KeyPad :tecles="tecles" :bloquejat="!jugant" :usades="resultats.map(r => r.tecla)" @premuda="rebreTecla" />

    <button class="boto-comencar" @click="iniciarPartida" :disabled="jugant">
      {{ jugant ? 'Comptant al teu cap…' : 'Començar' }}
    </button>

    <ResultsTable v-if="!jugant && resultats.length === tecles.length" :resultats="resultats" />

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

.salutacio {
  color: var(--text-suau);
  margin-bottom: 16px;
}

.salutacio strong {
  color: var(--accent);
}

.camp-nom {
  padding: 14px 16px;
  border: 1px solid var(--vora);
  border-radius: 12px;
  background: var(--tecla);
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.camp-nom::placeholder {
  color: var(--text-suau);
}

.camp-nom:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(255, 181, 71, 0.2);
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
  50% {
    opacity: 0.6;
  }
}
</style>