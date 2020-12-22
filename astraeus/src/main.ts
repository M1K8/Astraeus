import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import ToastService from 'primevue/toastservice';
import 'primevue/resources/primevue.css';
import 'primeicons/primeicons.css'
import 'animate.css'
import 'primevue/resources/themes/arya-blue/theme.css'; 

createApp(App)
  .use(store)
  .use(router)
  .use(ToastService)
  .mount("#app");

  

