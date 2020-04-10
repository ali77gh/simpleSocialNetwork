

export default class Like{
    
    who: string; // userId
    postID: string

    constructor(who: string, postId: string) {
        this.who = who;
        this.postID = postId;
    }
}