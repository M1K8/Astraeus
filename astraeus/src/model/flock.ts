import { User } from './user';

export class Flock {

    name: string;
    uid: string;

    members : (Array<User> | null) = null;
    avatar : (string | null) = null;
    owner! : User;

    constructor(name: string, uid: string) {
        this.uid = uid;
        this.name = name;
    }

}