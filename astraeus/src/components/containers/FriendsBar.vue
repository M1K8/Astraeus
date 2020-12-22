<template>
    <Toast position="top-right" />
    <text class="bar-label"> Friends </text>
    <div class="bar-wrapper">
        <div class="box">
            <FriendOrb v-for='friend in friends.arr' :key="friend.uid" :friend="friend" :ref="'friend_' + friend.uid" @ctx-menu-clicked="hideMenu" @remove-friend="removeFriend" @invite-friend="inviteFriend"/>
            <AddFriendOrb />
        </div>
    </div>
    
    <teleport to="#modal-wrapper">
        <Dialog modal=true v-model:visible="isModal">
           <InviteFriend @invite-sent="closeModalAndSubmit" :friend="selectedFriend.friend"/>
        </Dialog>
    </teleport>
</template>

<script lang="ts">
import Vue, { computed, defineComponent, reactive, ref, watchEffect, watch } from 'vue'
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import FriendOrb from '@/components/FriendOrb.vue'
import AddFriendOrb from '@/components/AddFriendOrb.vue'
import InviteFriend from '@/components/function/InviteFriend.vue'
import Dialog from 'primevue/dialog'
import { User } from '@/model/user'
import { useStore } from 'vuex'
import { db, functions } from '@/firebase'
import { hashToPound } from '@/util/stringFmt'

export default defineComponent({
    components : {
        FriendOrb,
        AddFriendOrb,
        InviteFriend,
        Dialog,
        Toast
    },

    setup() {
      const store = useStore();
      const toast = useToast();
      const lastMenuID = ref("");
      const isModal = ref(false);
      const friendsListGetter = computed( () => store.getters.getFriends );
      const emptyArr : object[] = [];
      const info = reactive({ });
      const friends = reactive({
        arr : emptyArr
      });

      const selectedFriend = reactive({
         friend : {
           username : String,
           uid : String
         }
      });

      watchEffect( async () => {
        const fList = friendsListGetter.value; //track this dependency
        const friendsArray : object[] = [];

        for (let i = 0; i < fList.length; ++i) {
            // get the normalised username of the friend, to access their "public"
            // db record
            const str = hashToPound(fList[i][1]);
            let friendObj = {};

            await db.ref("usernames").child(str).once('value', snap => {
              friendObj = snap.val();
            });          
            friendsArray.push(friendObj);
        }
        friends.arr = friendsArray;
      });

      async function removeFriend(friend : User) {
        const myUid = store.getters.getUid;
        const myName = store.getters.getName;
        const removeFriendFB = functions.httpsCallable("removeFriend");
        await removeFriendFB({
          senderName: myName,
          senderUID: myUid,
          recipName: friend.username,
          recipUID: friend.uid
        })
      }

      function inviteFriend(friend: any) {
        selectedFriend.friend = friend;

        isModal.value = true;

        const gameInfo : any = info;
      }

      async function closeModalAndSubmit(info : any) {
       const myUid = store.getters.getUid;
       const myName = store.getters.getName;
       const inviteFriendFB = functions.httpsCallable("gameInviteFriend");
       console.log(info)
       isModal.value = false;
       toast.add({severity:'success', summary:'Invite Sent!', details:`Invite sent to ${selectedFriend.friend.username}`, life: 5000})
       
       await inviteFriendFB({
         senderName: myName,
         senderUID: myUid,
         recipName: selectedFriend.friend.username,
         recipUID: selectedFriend.friend.uid,
         info: info
       })
      }


      return { friends, lastMenuID, removeFriend, inviteFriend, isModal, closeModalAndSubmit, selectedFriend }
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