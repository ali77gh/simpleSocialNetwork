import Follow from "../model/Follow";
import DBTools from "../DBTools";


export default class FollowRepo {

    public static get tableName() { return "follow" }  

    private static db;

    static init(db) {

        this.db = db;

        this.db.run(`create table IF NOT EXISTS ${this.tableName} (
            follower          text not null,
            followed          text not null,
            PRIMARY KEY (follower,followed),
            FOREIGN KEY(followed) REFERENCES user(username)
        );
        `, (err) => {
            if (err) {
                return console.error(this.tableName + err.message);
            }
            this.initStatments();
            DBTools.createIndex(db, this.tableName, "follower", "followed");
        });
    }

    private static stm = {
        follow: undefined,
        unfollow: undefined,
        getFollowers: undefined,
        getFollowing: undefined,
        getFollowersCount: undefined,
        getFollowingCount: undefined,
    }

    private static initStatments() {
        //generate binaries
        this.stm.follow = this.db.prepare(`INSERT INTO ${this.tableName} (follower, followed) VALUES (?, ?)`);
        this.stm.unfollow = this.db.prepare(`DELETE FROM ${this.tableName} WHERE follower = ? AND followed = ?;`)
        this.stm.getFollowers = this.db.prepare(`SELECT follower FROM ${this.tableName} WHERE followed = ?;`)
        this.stm.getFollowing = this.db.prepare(`SELECT followed FROM ${this.tableName} WHERE follower = ?;`)
        this.stm.getFollowersCount = this.db.prepare(`SELECT count(followed) FROM ${this.tableName} WHERE followed = ?;`)
        this.stm.getFollowingCount = this.db.prepare(`SELECT count(follower) FROM ${this.tableName} WHERE follower = ?;`)
    }

    static follow(follow: Follow, finished: (err: string) => void): void {
        this.stm.follow.run([follow.follower, follow.followed], (err) => {
            finished(err)
        })
    }

    static unfollow(follow: Follow, finished: (err: string) => void): void {
        this.stm.unfollow.run([follow.follower, follow.followed], (err) => {
            finished(err)
        })
    }

    static getFollowersByUsername(username: string, finished: (err: string, user: string[]) => void): void {

        this.stm.getFollowers.all([username], (err, rows:Follow[]) => {
            if (err) return finished(err, undefined)

            let tmp: string[] = []
            for (let i of rows) {
                tmp.push(i.follower)
            }
            finished(undefined,tmp);
        })

    }

    static getFollowingByUsername(username: string, finished: (err: string, user: string[]) => void): void {
        this.stm.getFollowing.all([username], (err, rows: Follow[]) => {
            if (err) return finished(err, undefined)

            let tmp: string[] = []
            for (let i of rows) {
                tmp.push(i.followed)
            }
            finished(undefined, tmp);
        })
    }

    static getFollowersCountByUsername(username: string, finished: (err: string, user: number) => void): void {

        this.stm.getFollowersCount.get([username], (err, row) => {
            if (err) return finished(err, undefined)
            finished(undefined, row["count(followed)"]);
        })

    }
    
    static getFollowingCountByUsername(username: string, finished: (err: string, user: number) => void): void {
        this.stm.getFollowingCount.get([username], (err, row) => {
            if (err) return finished(err, undefined)
            finished(undefined, row["count(follower)"]);
        })
    }
}