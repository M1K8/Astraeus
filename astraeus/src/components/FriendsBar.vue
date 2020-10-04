<template>
   <div id="friends-bar">
    <FriendOrb />   
    </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'
import FriendOrb from '@/components/FriendOrb.vue'
export default defineComponent({
    components : {
        FriendOrb
    }
});
</script>

<style lang="scss" scoped>
#friends-bar {
    flex-basis : 50vh; 
    flex-wrap: wrap;
    justify-content: space-evenly;
    background-color: orange;
}
</style>