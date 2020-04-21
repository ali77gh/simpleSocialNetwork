

export default class Config {

    // security
    public static get jwtKey() { return "masalan_alaki_;)" } //TODO change before deploy after commit 😂
    public static get gcLoopTime() { return 1000 * 60 * 60 } // 1 hour
    public static get expireTime() { return "1d" } // 1 day
    public static get hashtagPerPostLimit(){return 10}

    // paging configs
    public static limits = {
        get getCommentsByPostWithOffset(): number { return 2 },
        get getHashtagPosts(): number { return 2 },
        get getLikesByPostOffset(): number { return 2 },
        get getPostWithOwner(): number { return 2 },
        get getWall(): number { return 2 },
        get searchByUsername(): number {return 2}
    }
}