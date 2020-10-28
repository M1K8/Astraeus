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
import {db} from '../firebase'

export default {
    setup() {
        const store = useStore();
        const isExists = computed(() => {
            return store.getters.getIncomingFriendRequests;
        })
        const friendReqs = computed( () =>  {
            return Object.entries(store.getters.getIncomingFriendRequests);
        });

        function acceptFriend(friendRequest : any){
            const myUid = store.getters.getUid;
            //acceptFriend(me, them);

            db.ref("users").child(myUid).child("friends").child(friendRequest[1].target).set(true);
            db.ref("users").child(friendRequest[1].target).child("friends").child(myUid).set(true);

            db.ref("users").child(myUid).child("pendingFriendRequests").child(friendRequest[1].target).remove();
            db.ref("users").child(friendRequest[1].target).child("pendingFriendRequests").child(myUid).remove();
            // move to firebase func
        }

        return { friendReqs, acceptFriend, isExists }

    } 
}
</script>