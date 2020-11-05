import { User } from './user';

export interface Flock {

    name: string;
    uid: string;

    members : (Array<User> | null);
    avatar : (string | null);
    owner : User;

}