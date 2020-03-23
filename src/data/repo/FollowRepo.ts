import Follow from "../model/Follow";


//                                          sql injection note

// SQLite protects you against SQL injections if you specify user - supplied data as part of the params rather than stringing together an SQL query:
// BAD: db.prepare("INSERT INTO foo VALUES(" + variable + ")");
// GOOD: db.prepare("INSERT INTO foo VALUES (?)", variable);
// By using the placeholder ?, SQLite automatically treats the data as input data and it does not interfere with parsing the actual SQL statement.

export default class FollowRepo {

    private static tableName = "follow"

    private static db;

    static init(db) {

        this.db = db;

        this.db.exec(`
        create table IF NOT EXISTS ${this.tableName} (
            follower          text not null,
            followed          text not null
        );
        `);
    }

    static follow(follow: Follow): void {

        const insert = this.db.prepare(`INSERT INTO ${this.tableName} 
        (follower, followed) VALUES (?, ?)`);

        insert.run(follow.follower, follow.followed)

    }

    static unfollow(follow: Follow): void {
        this.db.prepare(`DELETE FROM ${this.tableName} WHERE follower = ? AND followed = ?;`).run(follow.follower,follow.followed);
    }

    static getFollowers(email: string, cb: (users: string[]) => void): void {

        let follows: Follow[] = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE followed = ?;`).get(email)

        let followers : string[] = []
        for (let i of follows) {
            followers.push(i.follower)
        }
        cb(followers);
    }

    static getFollowing(email: string, cb: (users: string[]) => void): void {
        let follows: Follow[] = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE follower = ?;`).get(email)

        let followings: string[] = []
        for (let i of follows) {
            followings.push(i.followed)
        }
        cb(followings);
    }

    static getAll(cb: (follows: Follow[]) => void): void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName}`).all());
    }
}