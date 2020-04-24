import { v4 as uuidv4 } from "uuid"

export default class Config {

    // security
    private static _jwtKey = "";
    public static get jwtKey() {
        if (this._jwtKey === "") this._jwtKey = uuidv4();
        return this._jwtKey;   
    }
    public static get gcLoopTime() { return 3600000 } // 1000 * 60 * 60 // 1 hour
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