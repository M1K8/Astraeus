<template>
  <div id="container">
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { messaging } from '@/firebase'
import component from '*.vue';
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    messaging.onMessage( (noti: { notification: { title: string; body: NotificationOptions|undefined; }; }) =>{
      console.log('Message received. ', noti);
      const notif = new Notification(noti.notification.title, noti.notification.body);
    })
   
    router.beforeEach( (to, from, next) => {
      store.dispatch('initAuth').then( user => {
        if (to.matched.some(record => record.meta.requiresAuth)) {
          if (user) {
            console.log("yay");
            if (to.path.startsWith("/friend")) {
              const friendStr = to.path.split("/")[2];
              const friendsList: string[] = store.getters.getFriendsList;
              
              if(friendsList.includes(friendStr)){
                next();
              } else {
                next('404');
              }

            } else {
              next();
            }
          } else {
            console.log("nay")
            next({
              name: "Login"
            });
          }
        } else if (to.matched.some(record => record.meta.noobOnly)) {
            if (user) {
              next('activity');
            } else {
              next();
            }
        } else {
          next();
        }
      })
    });
  },
}
</script>

<style lang="scss">
 * {
       margin: 0;
       background-color: #2c3e50 ;
   }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
} 

hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(100, 100, 100, 0.3), rgba(255, 255, 255, 0.85), rgba(100, 100, 100, 0.3));
}

#container {
  display: flex;
  flex-direction: column;
}
</style>
