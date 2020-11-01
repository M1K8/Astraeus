<template>
<div class="p-float-label p-input-icon-left">
    <i class="pi pi-user" />
	<InputText id="find-friend" type="text" v-model="value" />
	<label for="find-friend">Find friend...</label>
</div>

<Button label="Submit" @click="handleClick($event)"/>
</template>

<script lang="ts">
import Vue, { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import {db, functions} from '../firebase'
import {useStore} from 'vuex'
import {UsernameObject} from '@/model/usernameObject'
import { hashToPound } from '@/util/stringFmt'
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
            const normalisedStr = hashToPound(value.value); 
            db.ref("usernames").child(normalisedStr).once( "value", snapshot => {
                if (!snapshot.exists()) {
                    alert("User not found");
                } else  {
                    const user = snapshot.val();
                    const targetUid = user.uid;
                    //check request doesnt already exist
                    console.log(me)
                    if ( me.pendingFriendRequests != undefined ) {
                        if (me.pendingFriendRequests[targetUid]) {
                            alert("You already have a request with this user!");
                        }
                    } else if (me.friends != undefined && me.friends[targetUid]) {
                        alert("You already have this user as a friend!");
                    } else {
                        //lets add this friend:
                        const myUid = store.getters.getUid;
                        const myName = store.getters.getName;
                        const addFriend = functions.httpsCallable("addFriend");

                        addFriend({
                            senderUID : myUid,
                            recipUID : targetUid,
                            senderName: myName,
                            recipName : user.username
                        }).catch(function (error) {
                            alert("Error adding friend, please try again: " + error);
                        }).then( () => {
                            alert("Friend added!");
                            value.value = "";
                        })
                    }
                }
            });
        }
        return {value, handleClick}
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