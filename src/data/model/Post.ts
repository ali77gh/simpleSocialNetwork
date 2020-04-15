import { v4 as uuidv4 } from 'uuid';
import Joi from "joi"

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


    private constructor(owner: string, title: string, content: string) {
        this.owner = owner;
        this.title = title;
        this.content = content;
        this.time = new Date().getTime()
    }

    public static parse(userObj: any): Post {

        return new Post(
            userObj.owner,
            userObj.title,
            userObj.content,
        );
    }

    public static joi = {
        id: Joi.string().min(35).max(37).required(),// uuid length is 36
        owner: Joi.string().min(5).max(60).required().regex(/^[a-zA-Z0-9]+([_]?[a-zA-Z0-9])*$/),
        title: Joi.string().min(3).max(20).required(),
        content: Joi.string().min(0).max(1000).required(),
    }

}