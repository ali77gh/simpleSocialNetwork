

export default class Follow {

    follower: string; // who is following (email)
    followed: string; // who is followed (email)

    constructor(follower: string, followed: string) {
        this.follower = follower;
        this.followed = followed;
    }
}