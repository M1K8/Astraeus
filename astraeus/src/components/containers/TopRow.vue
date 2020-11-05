<template>
<div id="topContainer">
    <HomeLogo /> 

    <div class="padding"/>

    <SettingsContainer/>

    <div v-if="notiCount > 0" class="p-badge p-badge-danger" id="noti" @click="visibleRight = true"> {{notiCount}}</div>
    <div v-else class="p-badge p-badge-sucess" id="noti" @click="visibleRight = true"> </div>
  

    <Sidebar v-model:visible="visibleRight" :baseZIndex="1000" position="right">
      <NotificationBar />
    </Sidebar>
</div>
</template>

<script lang="ts">
import Vue, { computed, reactive, ref } from 'vue'
import HomeLogo from '@/components/HomeLogo.vue'
import SettingsContainer from '@/components/containers/SettingsContainer.vue'
import NotificationBar from '@/components/containers/NotificationBar.vue'
import Sidebar from 'primevue/sidebar'
import { useStore } from 'vuex'
export default {
    components : {
    HomeLogo,
    SettingsContainer,
    Sidebar,
    NotificationBar
  }, 
  setup() {
    const store        = useStore();
    const notiCount    = computed( () => store.getters.getAllIncomingNotis)

    const visibleRight = ref(false);

    return {visibleRight, notiCount}
  }
}
</script>

<style lang="scss" scoped>
#topContainer {
  display: flex;
  background-color: #2c3e50;
  flex: 90%;
}

#topContainer > logout-container {
  flex : 0 0 50px;
  background-color: yellow;
  margin-top: 5px;
  margin-right: 15px;

}

#topContainer > .padding {
  flex: 98%;
  background-color: green;
}

Button {
  background-color: green;
  border : none;
}

#noti {
      margin-top: 12px;
      margin-right: 10px;
      cursor : pointer;
}

</style>