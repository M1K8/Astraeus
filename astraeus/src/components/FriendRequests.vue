<template>
    <li v-for="f in friendReqs" :key="f[0]" style="margin: 20px">
        From {{f[1].senderName}}, 
        sent at {{f[1].sent}}
    </li>
</template>

<script lang="ts">

import Vue, { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const friendReqs = computed( () =>  {
           return Object.entries(store.getters.getIncomingFriendRequests);
        });

        return { friendReqs }

    } 
}
</script>