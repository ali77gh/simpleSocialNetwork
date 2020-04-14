import Post from "../model/Post";
import DBTools from "../DBTools";
import FollowRepo from "./FollowRepo";


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
        getWithOwner: undefined,
        getAll: undefined,
        countUserPosts: undefined,
        getWall: undefined,
        countWall:undefined
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (id, owner, title, content, time) VALUES (?, ?, ?, ?, ?)`);
        this.stm.updateTitle = this.db.prepare(`UPDATE ${this.tableName} SET title = ? WHERE id = ?;`)
        this.stm.updateContent = this.db.prepare(`UPDATE ${this.tableName} SET content = ? WHERE id = ?;`)
        this.stm.delete = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?;`)
        this.stm.getWithId = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?;`)
        this.stm.getWithOwner = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE owner = ? LIMIT 5 OFFSET ?;`)
        this.stm.countUserPosts = this.db.prepare(`SELECT count(owner) FROM ${this.tableName} WHERE owner = ?`)
        this.stm.getAll = this.db.prepare(`SELECT * FROM ${this.tableName}`)
        this.stm.getWall = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE owner = (SELECT followed FROM ${FollowRepo.tableName} WHERE follower = ?) LIMIT 5 OFFSET ?;`)
        this.stm.countWall = this.db.prepare(`SELECT count(id) FROM ${this.tableName} WHERE owner = (SELECT followed FROM ${FollowRepo.tableName} WHERE follower = ?);`)
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
            finished(err, row)
        })
    }

    static getWithOwner(owner: string, offset: number, finished: (err: string, posts: Post[]) => void): void {
        this.stm.getWithOwner.all([owner,offset], (err, row) => {
            finished(err, row)
        })
    }

    static countUserPosts(owner: string, finished: (err: string, users: number) => void): void {
        this.stm.countUserPosts.get([owner], (err, row) => {
            finished(err, row["count(owner)"])
        })
    }

    static getWall(username: string,offset: number, finished: (err: string, posts: Post[]) => void) {
        this.stm.getWall.all([username, offset], (err, rows) => {
            finished(err, rows)
        })
    }

    static countWall(username: string, finished: (err: string, posts: number) => void) {
        this.stm.getWall.get([username], (err, row) => {
            finished(err, row["count(id)"])
        })
    }
}