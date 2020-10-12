import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import 'primevue/resources/themes/arya-blue/theme.css'; 
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'
import 'animate.css'
import { VuelidatePlugin } from '@vuelidate/core';

createApp(App)
  .use(store)
  .use(router)
  .use(VuelidatePlugin)
  .mount("#app");


