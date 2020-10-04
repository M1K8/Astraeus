<template>
  <div id="home-container">
      <div id="social">
        <FriendsBar />
        <FlocksBar />
      </div>

      <div id="games" class="p-d-none p-d-md-inline-flex" >
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Options, Vue } from "vue-class-component";
import FriendsBar from '@/components/FriendsBar.vue'
import FlocksBar from '@/components/FlocksBar.vue'

export default defineComponent({
  components : {
      FriendsBar,
      FlocksBar,
      //ReccommendedGames,
      //RecentGames

  },

});
</script>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

#home-container {
  display: flex;
}

#social {
  display: flex;
  flex-direction: column;
  flex: 20%;
  background-color: red;
}

#games {
  display: flex;
  flex : 80%;
  background-color: black;;
}
</style>
