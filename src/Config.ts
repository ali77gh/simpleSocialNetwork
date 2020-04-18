

export default class Config {

    // security
    public static get jwtKey() { return "masalan_alaki_;)" } //TODO change before deploy after commit 😂
    public static get gcLoopTime() { return 1000 * 60 * 60 } // 1 hour
    public static get expireTime() { return "1d" } // 1 day

    // paging configs
    public static limits = {
        get getCommentsByPostWithOffset(): number { return 10 },
        get getHashtagPosts(): number { return 50 },
        get getLikesByPostOffset(): number { return 10 },
        get getPostWithOwner(): number { return 5 },
        get getWall(): number { return 10 },
        get searchByUsername(): number {return 10}
    }
}