

export default class Hashtag{

    postId: string
    hashtagName: string;

    constructor(postId: string, hashtagname: string) {
        this.postId = postId;
        this.hashtagName = hashtagname;
    }
}