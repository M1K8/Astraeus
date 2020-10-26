import { createStore } from "vuex";
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import { FBUser } from '@/model/FBUser'
import { db, auth } from '../firebase'

type State = {
  user : FBUser,
  uid : string | null,
  notifications : number,
  unsubscribeAuthObserver : any
}


function filterForIncoming(userObj : object){
  let numOfRequests = 0;
  if (userObj) {
    for (const [_, value] of Object.entries(userObj)) {
        if (value.type === "INCOMING") {
          ++numOfRequests;
        }
    }
  }
  return numOfRequests;
}

export default createStore({
  state: {
      user: {
        email : "",
        name : "",
        pendingFriendRequests : {},
        pendingFlockRequests : {},
        pendingGameRequests : {}
      },
      uid : null,
      notifications : 0,
      unsubscribeAuthObserver : null
  },

  mutations: {
    SET_UID(state : State, uid : string | null) {
      state.uid = uid;
    },
    SET_UNSUB(state : State, unsub : any) {
      state.unsubscribeAuthObserver = unsub;
    },
    INC_NOTIS(state : State) {
      state.notifications++;
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

    incrementNotis: ({commit}) => commit("INC_NOTIS"),

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
            if (!user.emailVerified) { 
              if (!getters.getSignup) {
                  alert("Unable to sign in - email not verified!");
                  auth.signOut();
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
    getName: ({user}) => {
      return user.name;
    },
    getState: (state: State) => {
      return state;
    },
    getUser: ({user}) => {
      return user;
    },
    getNotis: ({notifications}) => {
      return notifications;
    },
    getIncomingFriendRequests: ({user}) => {
      return user.pendingFriendRequests;
    },
    getIncomingFlockRequests: ({user}) => {
      return user.pendingFlockRequests;
    },
    getIncomingGameInvites: ({user}) => {
      return user.pendingGameRequests;
    },
    getAllIncomingNotis: ({user}) => {
      return filterForIncoming(user.pendingGameRequests) + 
              filterForIncoming(user.pendingFlockRequests) +
              filterForIncoming(user.pendingFriendRequests);
    }
  }
});