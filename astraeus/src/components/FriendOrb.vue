<template>
<router-link :to="{
    name: 'Friend',
    params : { slug: uid }
    }">
   <img src='@/assets/logo.png' />
</router-link>


</template>

<script lang="ts">
import Vue, { defineComponent, ref, computed } from 'vue'

export default defineComponent({
    setup() {
        const name = ref("Placeholder")
        const uid = ref(0xffff)
        const initial = computed (() => {
            return name.value.charAt(0)
        });

        //function goToFriendRouter() {
//
        //}

        return { name, uid, initial }
    }
});
</script>

<style lang="scss" scoped>
</style> 