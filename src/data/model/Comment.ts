

export default class Comment {


    who: string;
    postID: string;
    msg: string;

    constructor(who: string, postId: string , msg:string) {
        this.who = who;
        this.postID = postId;
        this.msg = msg;
    }
}