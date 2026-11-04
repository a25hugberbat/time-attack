<script setup>
defineProps({
  resultats: Array
})
</script>

<template>
  <table class="taula">
    <thead>
      <tr>
        <th>TECLA</th>
        <th>OBJECTIU</th>
        <th>TEMPS REAL</th>
        <th>ERROR</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="r in resultats" :key="r.tecla">
        <td><span class="badge">{{ r.tecla }}</span></td>
        <td>{{ r.objectiu }} s</td>
        <td>{{ r.tempsReal.toFixed(2) }} s</td>
        <td :class="Math.abs(r.error) < 0.5 ? 'be' : 'malament'">
          {{ r.error.toFixed(2) }} s
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
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

.malament {
  color: var(--malament);
}
</style>