<template>
    <text class="bar-label"> Flocks </text>
    <div class="bar-wrapper" id="flock-wrapper">
        <div class="box" id="flock-wrapper-box"> 
            <span> a </span>  
        </div>

    </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'
//import FriendOrb from '@/components/FriendOrb.vue'
export default defineComponent({
    components : {
        //FriendOrb,
     
    }
});
</script>

<style lang="scss" scoped>
#flock-wrapper {
    flex : 2 0 44vh; 
    flex-wrap : wrap;
    background-color: purple;
}
</style>