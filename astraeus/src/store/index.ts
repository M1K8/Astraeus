import { createStore } from "vuex";
import { vuexfireMutations, firebaseAction } from 'vuexfire'
import { FBUser } from '@/model/FBUser'
import { db, auth } from '../firebase'
import { hashToPound } from '@/util/stringFmt';

type State = {
  user : FBUser,
  uid : string | null,
  notifications : number,
  unsubscribeAuthObserver : any,
  isBound : boolean,
}


function filterForIncomingCount(userObj : object){
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

function filterForIncoming(userObj : object){
  const retObj = [];
  if (userObj) {
    for (const [_, value] of Object.entries(userObj)) {
        if (value.type === "INCOMING") {
          retObj.push(value);
        }
    }
  }
  return retObj;
}

//const onlineStatus = {
//  state: 'online',
//  last_changed: Date.now()
//}
//
//const offlineStatus = {
//  state: 'offline',
//  last_changed: Date.now()
//}

export default createStore({
  state: {
      user: {
        email : "",
        username : "",
        pendingFriendRequests : {},
        pendingFlockRequests : {},
        pendingGameRequests : {},
        friends: {}
      },
      uid : null,
      notifications : 0,
      isBound : false,
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
    SET_BOUND(state: State, res : boolean) {
      state.isBound = res;
    },
    ...vuexfireMutations,

  },
  actions: {
    bindUser: firebaseAction( ({ commit, getters, bindFirebaseRef }) => {
      if (!getters.getBound) {
        const uid = getters.getUid;
       // console.log("user bound");
        commit("SET_BOUND", true);
        return bindFirebaseRef('user', db.ref(`users/${uid}`))
      }
    }),

    unbindUser: firebaseAction( ({ commit, unbindFirebaseRef }) => {
      commit("SET_BOUND", false);
      unbindFirebaseRef('user');
     // console.log("user unbound");
    }),

    setUID: ({commit}, uid) => {
      commit("SET_UID",uid);
      //console.log("uid set to " + uid);
    },

    setSignup: ({commit}, isSignup) => commit("SET_SIGNUP", isSignup),

    incrementNotis: ({commit}) => commit("INC_NOTIS"),

    signOut: async (_) =>  await auth.signOut(),
      //unbind user & unset auth will be handled by listener

    initAuth: ( {dispatch, commit, getters, state} ) => {
      return new Promise( (resolve, reject) => {
        if (state.unsubscribeAuthObserver) {
          //console.log("unsub");
          state.unsubscribeAuthObserver();
        }
        const unsub = auth.onAuthStateChanged( async (user) => {
          if (user) {
            if (!user.emailVerified) { 
              if (!getters.getSignup) {
                  alert("Unable to proceed - email not verified!");
                  auth.signOut();
              }
              resolve(null)
            }
              if (!state.isBound) {
                await dispatch('setUID',user.uid);
                console.log("Logged in");
     
                await dispatch('bindUser');

                const formattedUsr = hashToPound(state.user.username);

                db.ref('.info/connected').on('value', snapshot => {
                  if (snapshot.val() === false){
                    return;
                  }

                  db.ref("usernames").child(formattedUsr).child("online").onDisconnect().set(0).then(() => {
                    db.ref("usernames").child(formattedUsr).child("online").set(1);
                  })
                });
              }
   
              resolve(user);
   
          } else {
              //onsole.log("Logged out")
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
    getBound: ({isBound}) => {
      return isBound;
    },
    getUid: ({uid}) => {
      return uid;
    },
    getName: ({user}) => {
      return user.username;
    },
    getFriends: ({user}) => {
      if (user.friends) {
        return Object.entries(user.friends);
      } else {
        return [];
      }
    },
    getFriendsList: ({user}) => {
      if (user.friends) {
        return Object.keys(user.friends);
      } else {
        return [];
      }
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
      return filterForIncoming(user.pendingFriendRequests);
    },
    getIncomingFlockRequests: ({user}) => {
      return user.pendingFlockRequests;
    },
    getIncomingGameInvites: ({user}) => {
      return user.pendingGameRequests;
    },
    getAllIncomingNotis: ({user}) => {
      return filterForIncomingCount(user.pendingGameRequests) + 
              filterForIncomingCount(user.pendingFlockRequests) +
              filterForIncomingCount(user.pendingFriendRequests);
    }
  }
});