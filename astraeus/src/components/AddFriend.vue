<template>
<span class="p-float-label p-input-icon-lef">
    <i class="pi pi-user" />
	<InputText id="find-friend" type="text" v-model="value" />
	<label for="find-friend">Find friend...</label>
</span>

<Button label="Submit" @click="handleClick($event)"/>
</template>

<script lang="ts">
import Vue, { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import {db} from '../firebase'
import {useStore} from 'vuex'
import {UsernameObject} from '@/model/usernameObject'
import { v4 as uuidv4 } from 'uuid'
export default {
    components: {
        InputText,
        Button
    },
    setup() {

        const value = ref("");
        const store = useStore();
        
        const me = store.getters.getUser;


        function handleClick(event : any) {
            const normalisedStr = value.value.replace('#', '_');
            db.ref("usernames").child(normalisedStr).once( "value", snapshot => {
                if (!snapshot.exists()) {
                    alert("User not found");
                } else  {
                    const user = snapshot.val();
                    const targetUid = user.uid;
                    //check request doesnt already exist
                    if ( me.pendingFriendRequests) {
                        if (me.pendingFriendRequests[targetUid]) {
                            alert("You already have a request with this user!");
                        }
                    } else {
                        //lets add this friend:
                        const myUid = store.getters.getUid;
                        const myName = store.getters.getName;
                        const now = Date.now();

                        const uidRef = db.ref("requests").push({
                            sender: myUid,
                            recipient: user.uid
                        })

                        db.ref("users").child(myUid).child("pendingFriendRequests").child(user.uid).set( {
                            type : "OUTGOING",
                            target: user.uid,
                            sent: now,
                            senderName: myName,
                            recipientName: user.username,
                            uid : uidRef.key
                        } );


                        db.ref("users").child(user.uid).child("pendingFriendRequests").child(myUid).set( {
                            type : "INCOMING",
                            target: myUid,
                            sent: now,
                            senderName: myName,
                            recipientName: user.username,
                            uid : uidRef.key
                        });

                        //to remove:

                        // db.ref.child(pendingRequests).child(otherUser).remove
                        // probably move to cloud function
                    }
                }
            });
        }


        return {value, handleClick}
    }

}
</script>

<style lang="scss" scoped>

</style>