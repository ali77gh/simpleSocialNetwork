

export default class Like{
    
    who: string
    postID: string

    constructor(who: string, postId: string) {
        this.who = who;
        this.postID = postId;
    }
}