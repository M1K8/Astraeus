<template>
    <div id="container"> 
        <FriendRequests />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { useStore } from 'vuex'
import FriendRequests from '@/components/function/FriendRequests.vue'
import FlockRequests from '@/components/FlockRequests.vue'
import GameRequests from '@/components/GameRequests.vue'
export default {

    components : {
        //GameRequests,
        //FlockRequests,
        FriendRequests
    }
    
}
</script>