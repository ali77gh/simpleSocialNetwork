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
    set id(id:string) {
        this._id = id;
    }

    owner: string; // username

    title: string;
    content: string;

    time: number; //unixtime


    static validate(Userobj): string | undefined {
        const schema = {
            owner: Joi.string().min(5).max(255).required().email(),
            title: Joi.string().min(5).max(255).required(),
            content: Joi.string().min(8).max(2000).required(),
            time: Joi.number()
        };

        const { error } = Joi.validate(Userobj, schema);
        if (error)
            return error.details[0].message;
        else
            return undefined;
    }


}