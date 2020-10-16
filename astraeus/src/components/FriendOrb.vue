<template>
    <ContextMenu ref="menu" :model="items" />
   
    <router-link class="friend-orb" :to="{
      name: 'Friend',
      params : { slug: uid }
    }"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    v-tooltip="name"
    >
        <div class='avatar-container' @contextmenu="onRightClick">
                <img src='@/assets/m1k.png' class="avatar"/>
                <div class="overlay orb" :class="{'avatar-hover': false}"> <img :src='getStatusOrb()' /> </div>
        </div>
    </router-link>
    
</template>

<script lang="ts">
import Vue, { defineComponent, ref, computed, onMounted } from 'vue'
import ContextMenu from 'primevue/contextmenu';
import Tooltip from 'primevue/tooltip';
import { User } from '@/model/user';

export default defineComponent({
    setup(props) {
        const name = ref(props.friend!.username)
        const uid = ref(props.friend!.uid)
        const initial = computed (() => {
            return name.value.charAt(0)
        });
        function getStatusOrb() {
            if (props.friend!.isOnline) {
                return require('@/assets/orbs/online.png')
            } else {
                return require('@/assets/orbs/offline.png') 
            }
        }

        const isHover = ref(false)

        return { name, uid, initial, getStatusOrb, isHover }
    },
    props : {
        friend : User
    },
    components : {
        ContextMenu
    },
    directives: {
    'tooltip': Tooltip
    },
    methods : {
        onRightClick(event: any) {
            // emit event to parent that we are open, which will them emit event to close
            // receives event, foreach child in friendsbar, if this.$refs.menu, this.$refs.menu.hide()
            const refs : any = this.$refs; 
            const menu : any = refs.menu;
            menu.show(event);    
        },
        hideMenu() {
            const refs : any = this.$refs; 
            const menu : any = refs.menu;
            menu.hide();    
        }    
    },
    data() {
        return {
            lastMenu: {
                menu : {
                    hide() {
                        console.log("hiding..")
                    } //interface?
                }
            },
            items: [
            {
                label:'New',
                icon:'pi pi-fw pi-plus',
                items:[
                {
                    label:'Bookmark',
                    icon:'pi pi-fw pi-bookmark',
                    command: (event : any ) => {
                        console.log(event.item)
                    }
                },
                {
                    label:'Video',
                    icon:'pi pi-fw pi-video'
                },

                ]
                },
                {
                    label:'Delete',
                    icon:'pi pi-fw pi-trash'
                },
                {
                    separator:true
                },
                {
                    label:'Export',
                    icon:'pi pi-fw pi-external-link'
                }
            ]
    }
    }
});
</script>

<style lang="scss">
.avatar {
    border-radius: 50%;
    display: block;
}
.avatar-hover {
        display: none;
    }
/* Container needed to position the overlay. Adjust the width as needed */
.avatar-container {
  position: relative;
  width: 50%;
  max-width: 50px;
}

/* The overlay effect - lays on top of the container and over the image */
.overlay {
  position: absolute;
  top: 25px;
  left: 25px;
}

.orb{
    clip-path: circle(6px at center);
    }

.p-tooltip-text {
    font-size: 0.8em;
}

.p-tooltip{
background-color: rgba(0,0,0,0);
}
</style> 