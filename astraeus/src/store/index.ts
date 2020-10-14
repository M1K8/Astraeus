import { createStore } from "vuex";
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import { db, auth } from '../firebase'

type State = {
  user : {},
  uid : string | null,
  unsubscribeAuthObserver : any,
  signup: boolean
}

export default createStore({
  state: {
      user: {},
      uid : "",
      unsubscribeAuthObserver : null,
      signup : false
  },

  mutations: {
    SET_UID(state : State, uid : string | null) {
      state.uid = uid;
    },
    SET_UNSUB(state : State, unsub : any) {
      state.unsubscribeAuthObserver = unsub;
    },
    SET_SIGNUP(state: State, isSignup: boolean) {
      state.signup = isSignup
    },
    ...vuexfireMutations,

  },
  actions: {
    bindUser: firebaseAction( ({ getters, bindFirebaseRef }) => {
      const uid = getters.getUid;
      return bindFirebaseRef('user', db.ref(`users/${uid}`))
    }),

    setUID: ({commit}, uid) => commit("SET_UID",uid),

    setSignup: ({commit}, isSignup) => commit("SET_SIGNUP", isSignup),

    initAuth: ( {dispatch, commit, getters, state} ) => {
      return new Promise( (resolve, reject) => {
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }
        const unsub = auth.onAuthStateChanged( async (user) => {
          if (user) {

            if (!user.emailVerified) {
              if (!getters.getSignup) {
                  alert("Unable to sign in - email not verified!");
              }
              resolve(null)
            }
              console.log("Auth logged in")
              await dispatch('setUID',user.uid);
   
              await dispatch('bindUser');
   
              resolve(user);
   
          } else {
              console.log("Auth logged out")
              await dispatch('setUID', null);
              resolve(null)
          }
          commit('SET_UNSUB', unsub);
        })
      })
    }
  },

  getters: {
    getUid: (state: State) => {
      return state.uid;
    },
    getState: (state: State) => {
      return state;
    },
    getSignup: (state: State) => {
      return state.signup;
    }

  }
});