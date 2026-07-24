import { createApp } from 'vue';
import App from './App.vue';
import { createAppContainer } from './di/container.js';
import { createContainerPlugin } from './di/plugin.js';

const container = createAppContainer();

createApp(App).use(createContainerPlugin(container)).mount('#app');
