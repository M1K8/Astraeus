<template>
    <text class="bar-label"> Friends </text>
    <div class="bar-wrapper">
        <div class="box">
            <FriendOrb :friend="f1" />   
            <AddFriendOrb />
        </div>

    </div>
</template>

<script lang="ts">
import Vue, { defineComponent, reactive } from 'vue'
import FriendOrb from '@/components/FriendOrb.vue'
import AddFriendOrb from '@/components/AddFriendOrb.vue'
import { User } from '@/model/user';
export default defineComponent({
    components : {
        FriendOrb,
        AddFriendOrb
    },

    setup() {
      const f1 = reactive(new User("test", "1"))

      return { f1 }
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