export interface FBUser {
    email : string;
    name : string;
    pendingFriendRequests : object;
    pendingGameRequests : object;
    pendingFlockRequests : object;
    friends: object;
}