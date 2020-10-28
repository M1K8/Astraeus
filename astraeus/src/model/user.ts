import { Flock } from './flock'

export class User {

    username: string;
    uid: string;
    avatar : (string | null) = null; 
    flocks: Array<Flock> | null = null; 
    //

    constructor(username: string, uid: string) {
        this.uid = uid;
        this.username = username;
    }

}