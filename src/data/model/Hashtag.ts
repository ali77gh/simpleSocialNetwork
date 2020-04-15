import Joi from "joi";
import Post from "./Post";

export default class Hashtag{

    postId: string
    hashtagName: string;

    private constructor(postId: string, hashtagname: string) {
        this.postId = postId;
        this.hashtagName = hashtagname;
    }

    public static parse(userObj: any): Hashtag {

        return new Hashtag(
            userObj.postId,
            userObj.hashtagName,
        );
    }

    public static joi = {
        postId: Post.joi.id,
        hashtagName: Joi.string().min(3).max(30).required()
    }
}