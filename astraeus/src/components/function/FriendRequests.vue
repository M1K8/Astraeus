<template>
<div v-if="isExists">
    <li v-for="f in friendReqs" :key="f[0]" style="margin: 20px" @click="acceptFriend(f)">
        From {{f[1].senderName}}, 
        sent at {{f[1].sent}}
    </li>
</div>
</template>

<script lang="ts">

import Vue, { computed, ref } from 'vue';
import { useStore } from 'vuex';
import {functions} from '@/firebase'
import { User } from '@/model/user';

export default {
    setup() {
        const store = useStore();
        const isExists = computed(() => {
            return store.getters.getIncomingFriendRequests;
        })
        const friendReqs = computed( () =>  {
            return Object.entries(store.getters.getIncomingFriendRequests);
        });

        async function acceptFriend(friendRequest : any){
            const acceptFriendFB = functions.httpsCallable("acceptFriend");
            console.log(friendRequest[1])

            const res = await acceptFriendFB({
                senderUID : friendRequest[1].sender,
                senderName: friendRequest[1].senderName,
                recipUID: friendRequest[1].target,
                recipName: friendRequest[1].recipientName,
                key: friendRequest[1].uid
            })

            console.log(res);
        }

        return { friendReqs, acceptFriend, isExists }

    } 
}
</script>