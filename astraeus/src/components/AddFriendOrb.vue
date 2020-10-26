<template>
<teleport to="#modal-wrapper">
    <Dialog modal=true v-model:visible="isModal">
        <AddFriend />
    </Dialog>
</teleport>

    <div @mouseover="isHover = true"
    @mouseleave="isHover = false"
    @keydown.esc.prevent="closeModal"
    @click="openModal">
        <div class='avatar-container' @contextmenu="onRightClick" >
            <img v-if="isHover" class="avatar" src='@/assets/orbs/online.png' /> 
            <img v-else class="avatar" src='@/assets/orbs/offline.png' />  
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { defineComponent, ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import AddFriend from '@/components/AddFriend.vue'

export default defineComponent({
    setup() {
        const isModal = ref(false);
        function openModal() {
            if (!isModal.value) {
                isModal.value = true;
            }
        }

        const isHover = ref(false)
        return { isHover, isModal, openModal }
    },
    components : {
        Dialog,
        AddFriend
    }
});
</script>

<style lang="scss" scoped>

</style>