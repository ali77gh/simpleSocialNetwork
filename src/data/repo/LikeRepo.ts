import DBTools from "../DBTools";
import Like from "../model/Like";
import Config from "../../Config";


export default class LikeRepo {

    public static get tableName() { return "like" }

    private static db;

    static init(db) {

        this.db = db;

        this.db.run(`create table IF NOT EXISTS ${this.tableName} (
            who             text not null,
            postId          text not null,
            PRIMARY KEY(who,postId),
            FOREIGN KEY (who) REFERENCES user (username),
            FOREIGN KEY (postID) REFERENCES post (id)
        );
        `, (err) => {
            if (err) {
                return console.error(this.tableName + err.message);
            }
            this.initStatments();
            DBTools.createIndex(db, this.tableName, "who", "postId");
        });
    }

    private static stm = {

        insert: undefined,
        delete: undefined,
        getLikesByPostOffset: undefined,
        countLikesByPost:undefined,
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (who, postId) VALUES (?, ?)`);
        this.stm.delete = this.db.prepare(`DELETE FROM ${this.tableName} WHERE who=? AND postId=?`);
        this.stm.getLikesByPostOffset = this.db.prepare(`SELECT who FROM ${this.tableName} WHERE postId=? LIMIT ${Config.limits.getLikesByPostOffset} OFFSET ?`);
        this.stm.countLikesByPost = this.db.prepare(`SELECT count(postId) FROM ${this.tableName} WHERE postId=?`);
        
    }

    public static newLike(like: Like, fininshed:(err)=>void) {
        this.stm.insert.run([like.who, like.postID], (err: string) => {
            fininshed(err)
        })
    }

    public static deleteLike(like: Like, fininshed: (err) => void) {
        this.stm.delete.run([like.who, like.postID], (err: string) => {
            fininshed(err)
        })
    }

    public static getLikesByPostOffset(postId:string,offset:number, fininshed: (err,usernames:string[]) => void) {
        this.stm.getLikesByPostOffset.all([postId, offset], (err: string, rows) => {
            
            let usernames: string[] = []
            for (let i of rows)
                usernames.push(i.who)
            fininshed(err,usernames)
        })
    }

    public static countLikesByPost(postId: string, fininshed: (err,count:number) => void) {
        this.stm.countLikesByPost.get([postId], (err: string,row) => {
            if (err) return fininshed(err,undefined)
            fininshed(err, row["count(postId)"])
        })
    }
}