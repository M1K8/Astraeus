<template>
<teleport to="#modal-wrapper">
    <Dialog modal=true v-model:visible="isModal" header="Remember to include the '#'">
        <AddFriend @friend-request-sent="closeModal"/>
    </Dialog>
</teleport>

    <div @mouseover="isHover = true"
    @mouseleave="isHover = false"
    @keydown.esc.prevent="closeModal"
    @click="openModal">
        <div class='avatar-container' >
            <img v-if="isHover" class="avatar" src='@/assets/orbs/online.png' /> 
            <img v-else class="avatar" src='@/assets/orbs/offline.png' />  
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { defineComponent, ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import AddFriend from '@/components/function/AddFriend.vue'

export default defineComponent({
    setup() {
        const isModal = ref(false);
        
        function openModal() {
            if (!isModal.value) {
                isModal.value = true;
            }
        }

        function closeModal() {
            if (isModal.value) {
                isModal.value = false;
            }
        }

        const isHover = ref(false)
        return { isHover, isModal, openModal, closeModal }
    },
    components : {
        Dialog,
        AddFriend
    }
});
</script>

<style lang="scss" scoped>

</style>