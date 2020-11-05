<template>
<!-- create flock form:
    name!!
    members?
    icon? - use this to test avatar uploading
 !-->

<Button label="Create" @click="handleClick($event)"/>

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
export default {
    components: {
        InputText,
        Button
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
    setup(prop : any, ctx : any) {
        const value = ref("");
        const message = ref("");
        const isModal = ref(false);

        const store = useStore();
        const me = store.getters.getUser;

        function handleClick(event : any) {
            /*
                - create flock w/ unique firebase id
                - add members to flock / flock to members

                - add func to generate invite links: one off, time expiry, perma
                - if (path.contains(join), firebasefunc(reqJoin(slug)); if(success) confirm else error)

                - polish firebase function to return errors
            */
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
    border: none;
    margin-left: 10px;
    margin-right: -10px;
    margin-bottom: 1px;
}

input {
    background-color: #121212;
}
</style>