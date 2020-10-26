export class FBUser {
    email : string;
    name : string;
    pendingFriendRequests : object;
    pendingGameRequests : object;
    pendingFlockRequests : object;

    constructor () {
        this.email = "";
        this.name = "";
        this.pendingFriendRequests = {};
        this.pendingGameRequests = {};
        this.pendingFlockRequests = {};
    }

}