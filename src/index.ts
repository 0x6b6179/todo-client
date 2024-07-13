import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.config.errorHandler = console.error

app.use(pinia);
app.mount('#app');
