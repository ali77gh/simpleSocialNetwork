import { v4 as uuidv4 } from 'uuid';

// Version 4(random) - Created from cryptographically - strong random values
// Version 1(timestamp) - Created from the system clock(plus random values)
// Version 5(namespace, SHA - 1) - Created from user - supplied name and namespace strings
// Version 3(namespace, MD5) - Like version 5, above, but with a poorer hash algorithm

export default class Post {

    private _id: string;
    get id() {
        if (!this._id) this._id = uuidv4();
        return this._id
    }
    set id(id: string) {
        this._id = id;
    }

    owner: string; // userId

    title: string;
    content: string;

    time: number; //unixtime


    constructor(owner: string, title: string, content: string) {
        this.owner = owner;
        this.title = title;
        this.content = content;
        this.time = new Date().getTime()
    }

}