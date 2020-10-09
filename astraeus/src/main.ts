import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import 'primevue/resources/themes/arya-blue/theme.css'; 
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'
import 'animate.css'

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
