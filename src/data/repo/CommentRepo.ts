import DBTools from "../DBTools";
import Comment from "../model/Comment";
import Config from "../../Config";


export default class CommentRepo {

    public static get tableName() { return "comment" }  

    private static db;

    static init(db) {

        this.db = db;

        this.db.run(`create table IF NOT EXISTS ${this.tableName} (
            id              text not null PRIMARY KEY,
            who             text not null,
            postId          text not null,
            msg             text not null,
            FOREIGN KEY (who) REFERENCES user (username),
            FOREIGN KEY (postID) REFERENCES post (id)
        );
        `, (err) => {
            if (err) {
                return console.error(this.tableName + err.message);
            }
            this.initStatments();
            DBTools.createIndex(db, this.tableName, "postId","id");
        });
    }

    private static stm = {

        newComment: undefined,
        deleteComment: undefined,
        getCommentsByPostWithOffset: undefined,
        countCommentsByPost: undefined,
        getOwnerByCommentId: undefined
    }

    private static initStatments() {
        //generate binaries
        this.stm.newComment = this.db.prepare(`INSERT INTO ${this.tableName} (id, who, postId, msg) VALUES (?, ?, ?, ?)`);
        this.stm.deleteComment = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
        this.stm.getCommentsByPostWithOffset = this.db.prepare(`SELECT id,who,msg FROM ${this.tableName} WHERE postId = ? LIMIT ${Config.limits.getCommentsByPostWithOffset} OFFSET ?`);
        this.stm.countCommentsByPost = this.db.prepare(`SELECT count(postId) FROM ${this.tableName} WHERE postId = ?`);
        this.stm.getOwnerByCommentId = this.db.prepare(`SELECT who FROM ${this.tableName} WHERE id = ?`);
    }

    static newComment(comment:Comment , finished: (err)=>void) {
        this.stm.newComment.run([comment.id, comment.who, comment.postId, comment.msg], (err) => {
            finished(err)
        })
    }

    static deleteComment(commentId: string, finished: (err) => void) {
        this.stm.deleteComment.run([commentId], (err) => {
            finished(err)
        })
    }

    static getCommentsByPostWithOffset(postId: string,offset, finished: (err,comments:Comment[]) => void) {
        this.stm.getCommentsByPostWithOffset.all([postId,offset], (err,rows) => {
            finished(err,rows)
        })
    }

    static countCommentsByPost(commentId: string, finished: (err,count) => void) {
        this.stm.countCommentsByPost.get([commentId], (err, row) => {
            if (err) return finished(err, undefined)
            finished(err, row["count(postId)"])
        })
    }

    static getOwnerByCommentId(commentId: string, finished: (err, owner) => void) {
        this.stm.getOwnerByCommentId.get([commentId], (err, row) => {
            finished(err, row["who"])
        })
    }
}