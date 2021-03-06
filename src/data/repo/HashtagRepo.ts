import Hashtag from "../model/Hashtag";
import DBTools from "../DBTools";
import Config from "../../Config";


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

        insertMany: undefined,
        removeMany: undefined,
        getPostHashtags: undefined,
        getHashtagPostsWithOffset: undefined,
        countHashtagPosts: undefined,
        searchHashtagByName: undefined,
        countPostHashtags: undefined
    }

    private static initStatments() {
        //generate binaries
        this.stm.insertMany = undefined; // this cant be like this
        this.stm.removeMany = undefined; // this cant be like this
        this.stm.getPostHashtags = this.db.prepare(`SELECT hashtagName FROM ${this.tableName} WHERE postId = ?;`);
        this.stm.countPostHashtags = this.db.prepare(`SELECT count(postId) FROM ${this.tableName} WHERE postId = ?;`);
        this.stm.getHashtagPostsWithOffset = this.db.prepare(`SELECT postId FROM ${this.tableName} WHERE hashtagName = ? LIMIT ${Config.limits.getHashtagPosts} OFFSET ?;`)
        this.stm.countHashtagPosts = this.db.prepare(`SELECT count(hashtagName) FROM ${this.tableName} WHERE hashtagName = ?`)
        this.stm.searchHashtagByName = this.db.prepare(`SELECT DISTINCT hashtagName FROM ${this.tableName} WHERE hashtagName LIKE ?`)
    }

    static addHashtags(postId: string, hashtagNames: string[], finished: (err) => void) {

        // generating sql query
        let placeholders = hashtagNames.map((_) => '(?,?)').join(',');
        let sql = `INSERT INTO ${this.tableName} (postId, hashtagName) VALUES ${placeholders} ;`
        

        // generating params
        let params: string[] = []
        for (let i of hashtagNames) {
            params.push(postId)
            params.push(i)
        }


        // launch apolo
        this.db.run(sql, params, (err)=> {
            finished(err);
        });
    }

    static removeHashtags(postId: string, hashtagNames: string[], finished: (err) => void): void {
        
        // generating sql query
        let placeholders = ""
        for (let i of hashtagNames) placeholders += "?,"
        placeholders = placeholders.slice(0, -1);
        let sql = `DELETE FROM ${this.tableName} WHERE postId = ? AND hashtagName IN (${placeholders}) ;`

        // generating params
        hashtagNames.unshift(postId)

        // launch apolo
        this.db.run(sql, hashtagNames, (err)=> {
            finished(err);
        });
    }

    static getPostHashtags(postId: string, finished: (err: string, hashtags: string[]) => void): void {

        this.stm.getPostHashtags.all([postId], (err, hashtags: Hashtag[]) => {

            if (hashtags) {
                let hashtagNames: string[] = []
                for (let i of hashtags) {
                    hashtagNames.push(i.hashtagName)
                }
                finished(err, hashtagNames)
            } else {
                finished(err, undefined)
            }
        })
    }

    static countPostHashtags(postId: string, finished: (err: string, hashtagsCount: string) => void): void {

        this.stm.countPostHashtags.get([postId], (err, row) => {

            finished(err, row["count(postId)"])
        })
    }

    static getHashtagPostsWithOffset(hashtagName: string, offset: number, finished: (err: string, postIds: string[]) => void): void {

        this.stm.getHashtagPostsWithOffset.all([hashtagName, offset], (err, hashtags: Hashtag[]) => {

            if (hashtags) {
                let postIds: string[] = []
                for (let i of hashtags) {
                    postIds.push(i.postId)
                }
                finished(err, postIds)
            } else {
                finished(err, undefined)
            }
        })
    }

    static countHashtagPosts(hashtagName: string, finished: (err: string, count: string) => void) {
        this.stm.countHashtagPosts.get([hashtagName], (err: string, row) => {

            finished(err, row["count(hashtagName)"])
        })
    }

    static searchHashtagByName(hashtagName, finished: (err: string, hashtags: string[]) => void) {
        hashtagName = "%" + hashtagName.replace(/ /g, "%") + "%";
        this.stm.searchHashtagByName.all([hashtagName], (err, rows) => {

            if (rows) {
                let hashtagNames: string[] = []
                for (let i of rows) {
                    hashtagNames.push(i.hashtagName)
                }
                finished(err, hashtagNames)
            } else {
                finished(err, undefined)
            }
        })
    }
}