<template>
    <text class="bar-label"> Friends </text>
    <div class="bar-wrapper">
        <div class="box">
            <FriendOrb v-for='friend in friends' :key="friend.uid" :friend="friend" :ref="'friend_' + friend.uid" @ctx-menu-clicked="hideMenu"/>
            <AddFriendOrb />
        </div>

    </div>
</template>

<script lang="ts">
import Vue, { defineComponent, reactive, ref } from 'vue'
import FriendOrb from '@/components/FriendOrb.vue'
import AddFriendOrb from '@/components/AddFriendOrb.vue'
import { User } from '../model/user';
import { useStore } from 'vuex'
import { db } from '../firebase'
export default defineComponent({
    components : {
        FriendOrb,
        AddFriendOrb
    },

    setup() {
      const f1 = reactive(new User("testA", "1"));
      const f2 = reactive(new User("testB", "2"));
      const store = useStore();

      const lastMenuID = ref("-1")

      const friendsUID = store.getters.getUser.friends;
      const friends = [f1, f2]//db.ref

      return { friends, lastMenuID }
    },
    methods: {
      hideMenu(thisID: string) {
        if (this.lastMenuID == thisID) {
          return;
        }
        const friendRefs : any = this.$refs;
        const excludeStr = "friend_" + thisID;
        const keys = Object.keys(friendRefs)

        const arrayedRefs = keys.map( (key) => {
          return [key, friendRefs[key]]
        })

        const newRef = arrayedRefs.filter( key => key[0] != excludeStr)

        newRef.forEach( (ref : any) => ref[1].hideMenu());

        this.lastMenuID = thisID;
      }
    }
});
</script>

<style lang="scss">
.bar-wrapper {
    flex: 0 5 48vh;
    background-color: orange;
    overflow: scroll;
}

.bar-wrapper::-webkit-scrollbar {
  width: 12px;               /* width of the entire scrollbar */
}
.wrapper::-webkit-scrollbar-track {
  background: orange;        /* color of the tracking area */
}
.wrapper::-webkit-scrollbar-thumb {
  background-color: blue;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 3px solid orange;  /* creates padding around scroll thumb */
}
::-webkit-scrollbar-corner {
  background: rgba(0,0,0,0);
}

* {
  scrollbar-width: thin;
  scrollbar-color: blue orange;
}

.box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    margin-left: 10px;
}

.box > * {
    padding: 6px;
    margin-top: 20px;
    background-color: 0%;
}
</style>