<template>
<div class="p-float-label p-input-icon-left">
    <i class="pi pi-user" />
	<InputText id="find-friend" type="text" v-model="value" />
	<label for="find-friend">Find friend...</label>
</div>

<Button label="Submit" @click="handleClick($event)"/>

<teleport to="#modal-wrapper">
    <Dialog modal=true v-model:visible="isModal" header="Error">
        {{message}}
    </Dialog>
</teleport>

</template>

<script lang="ts">
import Vue, { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import {db, functions} from '@/firebase'
import {useStore} from 'vuex'
import {UsernameObject} from '@/model/usernameObject'
import { hashToPound } from '@/util/stringFmt'
import Dialog from 'primevue/dialog'
export default {
    components: {
        InputText,
        Button,
        Dialog
    },
    emits: {
        'friend-request-sent' : (success : boolean) => {
            if (success) {
                return true;
            } else {
                return false;
            }
        }
    },
    setup(props: any, ctx: any) {
        const value = ref("");
        const message = ref("");
        const isModal = ref(false);

        const store = useStore();
        const me = store.getters.getUser;

        function handleClick(event : any) {
            const normalisedStr = hashToPound(value.value); 
            db.ref("usernames").child(normalisedStr).once( "value", snapshot => {
                if (!snapshot.exists()) {
                    message.value =("User not found");
                    isModal.value = true;
                    value.value = "";
                } else {
                    const user = snapshot.val();
                    const targetUid = user.uid;

                    if ( me.pendingFriendRequests != undefined ) {
                        if (me.pendingFriendRequests[targetUid]) {
                            message.value =("You already have a request with this user!");
                            isModal.value = true;
                            value.value = "";
                        }
                    } else if (me.friends != undefined && me.friends[targetUid]) {
                        message.value =("You already have this user as a friend!");
                        isModal.value = true;
                        value.value = "";
                    } else {
                        const myUid = store.getters.getUid;
                        const myName = store.getters.getName;
                        const addFriend = functions.httpsCallable("addFriend");

                        addFriend({
                            senderUID : myUid,
                            recipUID : targetUid,
                            senderName: myName,
                            recipName : user.username
                        }).catch(function (error) {
                            message.value =("Error adding friend, please try again: " + error);
                            isModal.value = true;
                        }).then( () => {
                            message.value = ("Friend request sent!");
                            isModal.value = true;
                            value.value = "";
                            ctx.emit("friend-request-sent", true);
                        })
                    }
                }
            });
        }
        return {value, handleClick, message, isModal}
    }

}
</script>

<style lang="scss" scoped>
*{
    background: #1e1e1e;
}

i {
    margin-left: 0px;
    padding-right: 5px;
    background-color: #1e1e1e;
}

label {
    margin-left: 20px;
    background-color : rgba(0,0,0,0);
}

button {
    background-color: #3e3e3e;
    border:none;
    margin-left: 10px;
    margin-right: -10px;
    margin-bottom: 1px;
}

input {
    background-color: #121212;
}
</style>