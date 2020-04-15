import User from "./User";
import Post from "./Post";


export default class Like {

    who: string; // userId
    postID: string

    private constructor(who: string, postId: string) {
        this.who = who;
        this.postID = postId;
    }

    public static parse(userObj: any): Like {

        return new Like(
            userObj.who,
            userObj.postId,
        );
    }

    public static joi = {
        who: User.joi.username,
        postID: Post.joi.id
    }

}