<script setup lang="ts">
import { GreeterToken } from './di/container.js';
import { useService } from './di/plugin.js';

const greeter = useService(GreeterToken);
const message = greeter.greet('Vue');
</script>

<template>
  <main>
    <h1>TinyDI + Vue</h1>
    <p>{{ message }}</p>
  </main>
</template>
