import Post from "../model/Post";
import DBTools from "../DBTools";


//                                          sql injection note

// SQLite protects you against SQL injections if you specify user - supplied data as part of the params rather than stringing together an SQL query:
// BAD: db.prepare("INSERT INTO foo VALUES(" + variable + ")");
// GOOD: db.prepare("INSERT INTO foo VALUES (?)", variable);
// By using the placeholder ?, SQLite automatically treats the data as input data and it does not interfere with parsing the actual SQL statement.

export default class PostRepo {

    private static tableName = "post"

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
        getAll: undefined
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (id, owner, title, content, time) VALUES (?, ?, ?, ?, ?)`);
        this.stm.updateTitle = this.db.prepare(`UPDATE ${this.tableName} SET title = ? WHERE id = ?;`)
        this.stm.updateContent = this.db.prepare(`UPDATE ${this.tableName} SET content = ? WHERE id = ?;`)
        this.stm.delete = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?;`)
        this.stm.getWithId = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?;`)
        this.stm.getWithOwner = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE owner = ?;`)
        this.stm.getAll = this.db.prepare(`SELECT * FROM ${this.tableName}`)
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

    static getWithOwner(owner: string, finished: (err: string, users: Post[]) => void): void {
        this.stm.getWithOwner.getAll([owner], (err, row) => {
            finished(err, row)
        })
    }

    static getAll(finished: (err: string, users: Post[]) => void): void {
        this.stm.getWithOwner.getAll([], (err, row) => {
            finished(err, row)
        })
    }
}