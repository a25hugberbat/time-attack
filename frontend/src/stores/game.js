import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {

  const nomJugador = ref('')
  const partides = ref([])

  const playerId = ref('')
  const roomCode = ref('')
  const phase = ref('lobby')
  const round = ref(0)
  const hostId = ref('')
  const targets = ref([])
  const players = ref([])
  const connected = ref(false)

  function guardarNom(nom) {
    nomJugador.value = nom
  }

  function guardarPartida(errorTotal) {
    partides.value.unshift({
      id: partides.value.length + 1,
      nom: nomJugador.value,
      errorTotal: errorTotal
    })
  }

  function esborrarPartides() {
    partides.value = []
  }

  // ACTUALITZAR LES DADES REBUDES DEL SERVIDOR
  function actualitzarSala(dades) {
    roomCode.value = dades.roomCode
    phase.value = dades.phase
    round.value = dades.round
    hostId.value = dades.hostId
    targets.value = dades.targets
    players.value = dades.players
  }

  // REINICIAR LES DADES DE LA SALA
  function reiniciarSala() {
    playerId.value = ''
    roomCode.value = ''
    phase.value = 'lobby'
    round.value = 0
    hostId.value = ''
    targets.value = []
    players.value = []
  }

  return {
    nomJugador,
    partides,
    playerId,
    roomCode,
    phase,
    round,
    hostId,
    targets,
    players,
    connected,
    guardarNom,
    guardarPartida,
    esborrarPartides,
    actualitzarSala,
    reiniciarSala
  }
})