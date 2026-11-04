<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

const millorMarca = computed(() => {
    //Comprueva que existan partidas, sino, devuelve null
    if (store.partides.length === 0){
        return null
    }
    //Itera en el array de partides de Pinia (store) y devuelve "errorTotal"              
    const errors = store.partides.map(partida => partida.errorTotal)
    //Los ... (se llama “spread”, esparcir) “desempaquetan” el array
    return Math.min(...errors)
})


</script>

<template>
  <section class="historial">

    <p class="etiqueta">Historial de partides</p>

    <p v-if="store.partides.length === 0" class="buit">
      No hi han partides registrades
    </p>

    <div v-else class="contingut">
      <p class="millor">
        Millor marca
        <span class="valor">{{ millorMarca }} s</span>
      </p>

      <table class="taula">
        <thead>
          <tr>
            <th>#</th>
            <th>JUGADOR</th>
            <th>ERROR TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="partida in store.partides" :key="partida.id">
            <td><span class="badge">{{ partida.id }}</span></td>
            <td>{{ partida.nom }}</td>
            <td :class="partida.errorTotal === millorMarca ? 'be' : ''">
              {{ partida.errorTotal }} s
            </td>
          </tr>
        </tbody>
      </table>

      <button class="boto-esborrar" @click="store.esborrarPartides()">
        Esborrar historial
      </button>
    </div>
  </section>
</template>

<style scoped>
.historial {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid var(--vora);
  border-radius: 16px;
  background: var(--fons);
}

.etiqueta {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
  text-align: center;
}

.buit {
  text-align: center;
  color: var(--text-suau);
  line-height: 1.6;
}

.contingut {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.millor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-suau);
  font-weight: 600;
}

.millor .valor {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  color: var(--be);
}

.taula {
  width: 100%;
  border-collapse: collapse;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
}

th {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-suau);
  font-weight: 600;
  padding: 0 8px 10px;
  text-align: right;
}

td {
  padding: 10px 8px;
  border-top: 1px solid var(--vora);
  text-align: right;
}

th:first-child,
td:first-child {
  text-align: left;
}

.badge {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--tecla);
  border: 1px solid var(--vora);
  font-weight: 700;
}

.be {
  color: var(--be);
}

.boto-esborrar {
  padding: 12px;
  border: 1px solid var(--malament);
  border-radius: 12px;
  background: transparent;
  color: var(--malament);
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s, background 0.15s, color 0.15s;
}

.boto-esborrar:hover {
  background: var(--malament);
  color: var(--fons);
}

.boto-esborrar:active {
  transform: scale(0.98);
}
</style>