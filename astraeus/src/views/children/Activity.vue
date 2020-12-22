<template>
    <text class="w"> {{username}} </text>
</template>

<script lang="ts">
import Vue, { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { db, messaging, vToken } from "@/firebase"
export default defineComponent({
  setup() {
      const store = useStore();

      Notification.requestPermission().then( async() => {
        console.log('Perms')
        const token = await messaging.getToken({vapidKey : vToken});
        if (token) {
          db.ref("users").child(store.getters.getUid).child("notificationTokens").once('value', snapshot => {
              if (!snapshot.exists()){
                db.ref("users").child(store.getters.getUid).child("notificationTokens").push(token);
              } else {
                const listOfTokens : string[] = Object.values(snapshot.val());

                if (!listOfTokens.includes(token)){
                    db.ref("users").child(store.getters.getUid).child("notificationTokens").push(token);
                }
              }
          })
        }
      }).catch( (error) => {
        console.log(error)
      })

      const username = ref(store.getters.getName);

      return {username}
  }
})
</script>
<style lang="scss" scoped>
.w {
    flex-basis: 100%;
}
</style>