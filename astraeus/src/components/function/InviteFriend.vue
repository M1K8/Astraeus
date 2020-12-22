
<template>
    <div class="text-box">
        <p> Invite <i style="font-style: italic">{{friend.username}}</i> to play <i id="space"> </i> <InputText id="game-name" type="text" v-model="gameName" /> </p>

        <div class="acc">
            <p> Using  <i id="space"> </i> <Dropdown v-model="selectedType" :options="chatOptions" optionLabel="name" placeholder="Server type (optional)" :showClear="true" /> </p>
        </div>
        <div v-show="selectedTypeChosen" class="acc" >
            <p> Server URL: <i id="space"> </i> <InputText id="server-url" type="text" v-model="serverURL" /> </p>
        </div>

        <Button label="Submit" @click="handleClick()"/>
    </div>
</template>
<script lang="ts">
import Vue, { computed, reactive, ref, watch, watchEffect } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

export default {
    components: {
        InputText,
        Dropdown,
        Button
    },
    props: {
        friend : Object
    },
    setup(props: any, ctx: any) {
        const chatOptions = [
            {name: "Discord", },
            {name: "Teamspeak"},
        ]

        const selectedType = ref("")

        const selectedTypeChosen = computed( () => {
            return (selectedType.value !== "" && selectedType.value !== null);
        })

        const serverURL = ref("");

        const gameName = ref("");

        function handleClick() {
            ctx.emit("invite-sent", {
                game: gameName,
                location: selectedType.value,
                serverURL: serverURL.value
            })

        }
        return {chatOptions, selectedTypeChosen, selectedType, serverURL, gameName, handleClick}
    }
    
}
</script>

<style lang="scss" scoped>

InputText{
    flex-grow: 1;
    align-items: flex-start;
    margin-left: 5px;
}

p {
    padding-right: 12px;
    padding-bottom: 15px;
    background-color: rgba(234,234,234,0);
}

* {
    background: rgba(234,234,234,0);
}


#game-name,  #server-url {
    background: rgba(234,234,234,0);
}

#space {
    margin-left:10px;
}
span {
    background: rgba(234,234,234,0);
}

.acc {
    padding-bottom: 15px;
}
</style>