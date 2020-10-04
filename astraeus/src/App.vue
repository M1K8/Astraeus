<template>
  <div id="container">
    <TopRow />
    <hr/>
    <HomeBody />
  </div>
</template>

<script lang="ts">
import { createApp, defineComponent } from 'vue' 
import TopRow from "@/components/TopRow.vue"
import HomeBody from "@/components/HomeBody.vue"
//import FriendsBar from '@/components/FriendsBar.vue'
//import FlocksBar from '@/components/FlocksBar.vue'

export default {
  components: {
    TopRow,
    HomeBody
  }
}

</script>

<style lang="scss">
 * {
       margin: 0
       ;
       background-color: #2c3e50 ;
   }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background-color: #2c3e50;
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
