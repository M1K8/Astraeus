<template>
    <router-link :to="{
      name: 'AddFriend',
    }"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    >
        <div class='avatar-container' @contextmenu="onRightClick" >
            <img v-if="isHover" class="avatar" src='@/assets/orbs/online.png' /> 
            <img v-else class="avatar" src='@/assets/orbs/offline.png' />  
        </div>
    </router-link>
</template>

<script lang="ts">
import Vue, { defineComponent, ref, computed } from 'vue'

export default defineComponent({
    setup() {

        const isHover = ref(false)

        return { isHover }
    },
    methods : {
        onRightClick(event: any) {
            const refs : any = this.$refs; 
            const menu : any = refs.menu;
            menu.show(event);
            //set state ref so only one can be shown at a time
        }
    }
});
</script>

<style lang="scss" scoped>

</style>