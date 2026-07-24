<script setup lang="ts">
import { GreeterToken } from '../services/greeter';

const greeter = useService(GreeterToken);
const message = greeter.greet('Nuxt');
</script>

<template>
  <main>
    <h1>TinyDI + Nuxt</h1>
    <p>{{ message }}</p>
  </main>
</template>
