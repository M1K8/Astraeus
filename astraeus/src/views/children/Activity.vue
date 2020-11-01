<template>
    <text class="w"> {{username}} </text>
</template>

<script lang="ts">
import Vue, { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
    setup() {
        const store = useStore();

        const username = ref(store.getters.getName);

        return {username}
    }
    
})
</script>
<style lang="scss" scoped>
.w {
    flex-basis: 100%;
}
</style>