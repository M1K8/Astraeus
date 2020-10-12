import { createStore } from "vuex";
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import { db } from '../firebase'

type State = {
  user : {},
  uid : string,
  auth : boolean
}

export default createStore({
  state: {
      user: {},
      uid : "",
      auth : false
  },

  mutations: {
    SET_UID(state : State, uid : string) {
      state.uid = uid;
    },
    SET_AUTH(state : State) {
      state.auth = true;
    },
    ...vuexfireMutations,

  },
  actions: {

    bindUser: firebaseAction( ({ getters, bindFirebaseRef }) => {
      const uid = getters.getUid();
      return bindFirebaseRef('user', db.ref(`users/${uid}`))
    }),
    setUID: (ctx, uid) => ctx.commit("SET_UID",uid),
    setAuth: ({commit}) => commit("SET_AUTH")
  },

  getters: {
    getUid: (state: State) => {
      return state.uid;
    }

  }
});