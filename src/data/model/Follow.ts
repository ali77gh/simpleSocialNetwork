

export default class Follow {

    follower: string; // who is following (userId)
    followed: string; // who is followed (userId)

    constructor(follower: string, followed: string) {
        this.follower = follower;
        this.followed = followed;
    }
}