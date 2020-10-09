import { Flock } from './flock'

export class User {

    username: string;
    uid: string;

    //reactively updated once registered to the UI
    isOnline = false; 
    avatar : (string | null) = null; 
    flocks: Array<Flock> | null = null; 
    //

    constructor(username: string, uid: string) {
        this.uid = uid;
        this.username = username;
    }

}