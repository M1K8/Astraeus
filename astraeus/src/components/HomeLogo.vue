<template>
    <router-link to="/"><img src="@/assets/m1k.png" @click="signout" id="logo" /></router-link> 
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore();
    const router = useRouter();


    async function signout() {
      await store.dispatch('signOut');
      
      router.push('Login');

    }

    return { signout }
  }
}

</script>

<style scoped lang="scss">
a img {
  flex : 2%;
  background-color: #1dc93a;
  
  margin-top: 5px;
  margin-right: 10px;
  margin-left: 15px;
}
</style>
