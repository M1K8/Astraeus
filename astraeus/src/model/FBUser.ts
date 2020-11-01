export interface FBUser {
    email : string;
    username : string;
    pendingFriendRequests : object;
    pendingGameRequests : object;
    pendingFlockRequests : object;
    friends: object;
}