

export default class Comment {

    id: string
    who: string; //userId
    postID: string;
    msg: string;

    constructor(who: string, postId: string , msg:string) {
        this.who = who;
        this.postID = postId;
        this.msg = msg;
    }
}