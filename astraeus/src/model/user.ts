import { Flock } from './flock'

export interface User {

    username: string;
    uid: string;
    online: number;
    avatar : (string | null); 
    flocks: Array<Flock> | null; 
}