import { v4 as uuidv4 } from "uuid"
import Joi from "joi"
import User from "./User";
import Post from "./Post";

export default class Comment {

    _id: string
    get id() {
        if (!this._id) this._id = uuidv4();
        return this._id
    }
    set id(id: string) {
        this._id = id;
    }

    who: string; //userId
    postId: string;
    msg: string;

    private constructor(who: string, postId: string , msg:string) {
        this.who = who;
        this.postId = postId;
        this.msg = msg;
    }

    public static parse(userObj: any): Comment {

        return new Comment(
            userObj.who,
            userObj.postId,
            userObj.msg
        );
    }

    public static joi = {
        id: Joi.string().min(35).max(37).required(),// uuid length is 36
        who: User.joi.username,
        postId: Post.joi.id,
        msg: Joi.string().min(8).max(60).required(),
    }
}