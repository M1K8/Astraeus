import { createStore } from "vuex";
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import { db, auth } from '../firebase'

type State = {
  user : {},
  uid : string | null,
  unsubscribeAuthObserver : any
}

export default createStore({
  state: {
      user: {},
      uid : null,
      unsubscribeAuthObserver : null
  },

  mutations: {
    SET_UID(state : State, uid : string | null) {
      state.uid = uid;
    },
    SET_UNSUB(state : State, unsub : any) {
      state.unsubscribeAuthObserver = unsub;
    },
    ...vuexfireMutations,

  },
  actions: {
    bindUser: firebaseAction( ({ getters, bindFirebaseRef }) => {
      const uid = getters.getUid;
      console.log("user bound")
      return bindFirebaseRef('user', db.ref(`users/${uid}`))
    }),

    unbindUser: firebaseAction( ({ unbindFirebaseRef }) => {
      unbindFirebaseRef('user')
      console.log("user unbound")
    }),

    setUID: ({commit}, uid) => {
      commit("SET_UID",uid)
      console.log("uid set to " + uid)
    },

    setSignup: ({commit}, isSignup) => commit("SET_SIGNUP", isSignup),

    signOut: async (ctx) =>  await auth.signOut(),
      //unbind user & unset auth will be handled by listener

    initAuth: ( {dispatch, commit, getters, state} ) => {
      return new Promise( (resolve, reject) => {
        if (state.unsubscribeAuthObserver) {
          console.log("unsub")
          state.unsubscribeAuthObserver()
        }
        const unsub = auth.onAuthStateChanged( async (user) => {
          if (user) {

            //if (!user.emailVerified) { //save for adding friends etc, prune unverified accounts after 31 days
            //  if (!getters.getSignup) {
            //      alert("Unable to sign in - email not verified!");
            //  }
            //  resolve(null)
            //}
              console.log("Auth logged in")
              await dispatch('setUID',user.uid);
   
              await dispatch('bindUser');
   
              resolve(user);
   
          } else {
              console.log("Auth logged out")
              await dispatch('setUID', null);
              await dispatch('unbindUser');
              resolve(null)
          }
          commit('SET_UNSUB', unsub);
        })
      })
    }
  },

  getters: {
    getUid: ({uid}) => {
      return uid;
    },
    getState: (state: State) => {
      return state;
    },
    getUser: ({user}) => {
      return user;
    }
  }
});