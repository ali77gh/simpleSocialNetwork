import Post from "../model/Post";
import DBTools from "../DBTools";
import FollowRepo from "./FollowRepo";
import Config from "../../Config";


export default class PostRepo {

    public static get tableName() { return "post" }

    private static db;

    static init(db) {

        this.db = db;

        this.db.run(`
        create table IF NOT EXISTS ${this.tableName} (
            id             text not null PRIMARY KEY,
            owner          text not null,
            title          text not null,
            content        text not null,
            time           integer,
            FOREIGN KEY (owner) REFERENCES user (username) 
        );
        `, (err) => {
            if (err) {
                return console.error(this.tableName + err.message);
            }
            this.initStatments();
            DBTools.createIndex(db, this.tableName, "id", "owner");
        });
    }


    private static stm = {

        insert: undefined,
        updateTitle: undefined,
        updateContent: undefined,
        delete: undefined,
        getWithId: undefined,
        getWithOwnerWithOffset: undefined,
        getAll: undefined,
        countUserPosts: undefined,
        getWallWithOffset: undefined,
        countWall:undefined
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (id, owner, title, content, time) VALUES (?, ?, ?, ?, ?)`);
        this.stm.updateTitle = this.db.prepare(`UPDATE ${this.tableName} SET title = ? WHERE id = ?;`)
        this.stm.updateContent = this.db.prepare(`UPDATE ${this.tableName} SET content = ? WHERE id = ?;`)
        this.stm.delete = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?;`)
        this.stm.getWithId = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?;`)
        this.stm.getWithOwnerWithOffset = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE owner = ? LIMIT ${Config.limits.getPostWithOwner} OFFSET ?;`)
        this.stm.countUserPosts = this.db.prepare(`SELECT count(owner) FROM ${this.tableName} WHERE owner = ?`)
        this.stm.getAll = this.db.prepare(`SELECT * FROM ${this.tableName}`)
        this.stm.getWallWithOffset = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE owner IN (SELECT followed FROM ${FollowRepo.tableName} WHERE follower = ?) LIMIT ${Config.limits.getWall} OFFSET ?;`)
        this.stm.countWall = this.db.prepare(`SELECT count(id) FROM ${this.tableName} WHERE owner IN (SELECT followed FROM ${FollowRepo.tableName} WHERE follower = ?);`)
    }

    static add(post: Post, finished: (err: string) => void): void {
        this.stm.insert.run([post.id, post.owner, post.title, post.content, post.time], (err) => {
            finished(err);
        })
    }


    static updateTitle(id: string, newTitle: string, finished: (err: string) => void): void {
        this.stm.updateTitle.run([newTitle, id], (err) => {
            finished(err)
        })
    }

    static updateContent(id: string, newContent: string, finished: (err: string) => void): void {
        this.stm.updateContent.run([newContent, id], (err) => {
            finished(err)
        })
    }

    static delete(id: string, finished: (err: string) => void): void {
        this.stm.delete.run([id], (err) => {
            finished(err)
        })
    }

    static getWithId(id: string, finished: (err: string, post: Post) => void): void {
        this.stm.getWithId.get([id], (err, row) => {
            if(!err && !row) return finished("post not found",undefined)
            finished(err, row)
        })
    }

    static getWithOwnerWithOffset(owner: string, offset: number, finished: (err: string, posts: Post[]) => void): void {
        this.stm.getWithOwnerWithOffset.all([owner,offset], (err, row) => {
            finished(err, row)
        })
    }

    static countUserPosts(owner: string, finished: (err: string, posts: string) => void): void {
        this.stm.countUserPosts.get([owner], (err, row) => {
            finished(err, row["count(owner)"])
        })
    }

    static getWallWithOffset(username: string,offset: number, finished: (err: string, posts: Post[]) => void) {
        this.stm.getWallWithOffset.all([username, offset], (err, rows) => {
            finished(err, rows)
        })
    }

    static countWall(username: string, finished: (err: string, posts: string) => void) {
        this.stm.countWall.get([username], (err, row) => {
            if (err) return finished(err, undefined)
            finished(err, row["count(id)"])
        })
    }
}