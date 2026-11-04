<script setup>
import { ref } from 'vue'

const codiSala = ref('DAW2')

const emit = defineEmits(['entrar'])

function entrar() {
    emit('entrar', codiSala.value.trim().toUpperCase())
}
</script>

<template>
    <div>
        <h2>ENTRAR EN UNA SALA</h2>

        <input v-model="codiSala" placeholder="Codi de sala" />

        <button @click="entrar">
            Entrar a la sala
        </button>
    </div>
</template>