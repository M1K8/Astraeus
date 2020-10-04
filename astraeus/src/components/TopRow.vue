<template>
<div id="topContainer">
    <HomeLogo /> 

    <padding/>

    <SettingsContainer/>

    <logout-container/>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import HomeLogo from '@/components/HomeLogo.vue'
import SettingsContainer from '@/components/SettingsContainer.vue'
export default {
    components : {
    HomeLogo,
    SettingsContainer
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

     #topContainer > padding {
      flex: 98%;
      background-color: green;
    }
</style>