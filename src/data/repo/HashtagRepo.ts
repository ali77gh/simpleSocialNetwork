import Hashtag from "../model/Hashtag";
import DBTools from "../DBTools";


export default class HashtagRepo {

    public static get tableName() { return "hashtag" }

    private static db;

    static init(db) {

        this.db = db;

        this.db.run(`create table IF NOT EXISTS ${this.tableName} (
            postId          text not null,
            hashtagName     text not null,
            PRIMARY KEY(hashtagName,postId),
            FOREIGN KEY (postId) REFERENCES post (id)
        );`, (err) => {
            if (err) {
                return console.error(this.tableName + err.message);
            }
            this.initStatments();
            DBTools.createIndex(db, this.tableName, "postId", "hashtagName");
        });
    }

    private static stm = {

        insert: undefined,
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (postId, hashtagName) VALUES (?, ?)`);

    }

    static setHashtag(hashtag: Hashtag): void {

        const insert = this.db.prepare(`INSERT INTO ${this.tableName} 
        (postId, hashtagName) VALUES (?, ?)`);

        insert.run(hashtag.postId, hashtag.hashtagName)

    }

    static removeHashtag(hashtag: Hashtag): void {
        this.db.prepare(`DELETE FROM ${this.tableName} WHERE postId = ? AND hashtagName = ?;`).run(hashtag.postId, hashtag.hashtagName);
    }

    static getPostHashtags(postId: string, cb: (hashtags: string[]) => void): void {

        let hashtags: Hashtag[] = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE postId = ?;`).get(postId)

        let hashtagNames: string[] = []
        for (let i of hashtags) {
            hashtagNames.push(i.hashtagName)
        }
        cb(hashtagNames);
    }

    static getHashtagPosts(hashtagName: string, cb: (postIds: string[]) => void): void {

        let hashtags: Hashtag[] = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE hashtagName = ?;`).get(hashtagName)

        let postIds: string[] = []
        for (let i of hashtags) {
            postIds.push(i.postId)
        }
        cb(postIds);
    }

    static getAll(cb: (follows: Hashtag[]) => void): void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName}`).all());
    }
}