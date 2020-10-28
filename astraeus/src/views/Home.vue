<template>
  <TopRow/>
  <hr />
  <div id="home-container">
      <div id="social">
        <FriendsBar />
        <FlocksBar />
      </div>

      <div id="main-view" class="p-d-none p-d-md-inline-flex" >
        <router-view :key="$route.path" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'
import FriendsBar from '@/components/FriendsBar.vue'
import FlocksBar from '@/components/FlocksBar.vue'
import TopRow from '@/components/TopRow.vue'
import { useStore } from 'vuex'

export default defineComponent({
  components : {
      FriendsBar,
      TopRow,
      FlocksBar,
      //ReccommendedGames,
      //RecentGames

  }
  });
</script>

<style lang="scss">
@import 'primeflex/primeflex.scss';

#home-container {
  display: flex;
}

.bar-label{
  flex : 2%;
  background-color: inherit;
}

#social {
  display: flex;
  flex-direction: column;
  flex: 6vw;
}

#main-view {
  display: flex;
  flex: 96vw;
}
</style>
