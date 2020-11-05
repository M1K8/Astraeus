<template> 
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
                <img class="overlay orb" :class="{'avatar-hover': isHover}" :src='getStatusOrb' />
        </div>
    </router-link>
    <ContextMenu ref="menu" :model="items" />
</template>

<script lang="ts">
import Vue, { defineComponent, ref, computed, onMounted, watchEffect, watch } from 'vue'
import ContextMenu from 'primevue/contextmenu';
import Tooltip from 'primevue/tooltip';
import { db } from '@/firebase';
import { hashToPound } from '@/util/stringFmt';
import { User } from '@/model/user';

export default defineComponent({
    setup(props) {
        const name = ref(props.friend!.username)
        const uid = ref(props.friend!.uid)
        const online = ref(0);

        const friendRef = db.ref("usernames").child(hashToPound(name.value));

        const initial = computed (() => {
            return name.value.charAt(0)
        });

        const getStatusOrb = computed(() => {
            if (online.value === 1) {
                return require('../assets/orbs/online.png')
            } else {
                return require('../assets/orbs/offline.png')
            }
        })

        //get an up to date online status
        watchEffect( () => {
            friendRef.child("online").on('value', snap => {
                if (snap.exists()){
                    online.value = snap.val();
                }
            });
        });

        const isHover = ref(false)

        return { name, uid, initial, getStatusOrb, isHover }
    },
    props : {
        friend : Object
    },
    components : {
        ContextMenu
    },
    directives: {
    'tooltip': Tooltip
    },
    emits: {
        'ctx-menu-clicked' : (id : string) => {
            if (id) {
                return true;
            } else {
                return false;
            }
        },
        'remove-friend' : (id : string) => {
            if (id) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods : {
        onRightClick(event: any) {
            // emit event to parent that we are open, which will them emit event to close
            // receives event, foreach child in friendsbar, if this.$refs.menu, this.$refs.menu.hide()
            const menu : any = this.$refs.menu;
            this.$emit("ctx-menu-clicked", this.uid); 
            menu.show(event);   
        },
        hideMenu() {
            const menu : any = this.$refs.menu;
            if (menu) {
                menu.hide();   
            }
        }
    },
    data() {
        let gameName = "";
        let location = "";
        let serverURL = "";
        return {
            items: [
            {
                label:'Remove Friend',
                icon:'pi pi-fw pi-plus',
                command: (event: any) => {
                    this.$emit("remove-friend", this.friend!); 
                }
            },
              {
                label:'Add friend to flock',
                icon:'pi pi-fw pi-plus',
                command: (event: any) => {
                    console.log(this.friend!);
                }
            },
              {
                label:'Invite to game',
                icon:'pi pi-fw pi-plus',
                command: (event: any) => {
                    this.$emit("invite-friend", {friend: this.friend!, info : {
                        gameName: "gameName",
                        location: "location",
                        serverURL : "serverURL",
                    }});
                }
            },
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
  top: 26px;
  left: 26px;
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