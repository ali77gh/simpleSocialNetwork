import Post from "../model/Post";


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

        this.db.exec(`
        create table IF NOT EXISTS ${this.tableName} (
            id             text not null,
            owner          text not null,
            title          text not null,
            content        text not null,
            time           integer
        );
        `);
    }

    static add(post: Post): void {

        const insert = this.db.prepare(`INSERT INTO ${this.tableName} 
        (id, owner, title, content, time) VALUES (?, ?, ?, ?, ?)`);

        insert.run(post.id, post.owner, post.title, post.content, post.time)

    }

    static updateTitle(id: string, newTitle: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET title = ? 
            WHERE id = ?;
            `).run(newTitle, id);
    }

    static updateContent(id: string, newContent: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET content = ? 
            WHERE id = ?;
            `).run(newContent, id)
    }

    static delete(id: string): void {
        this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?;`).run(id);
    }

    static getWithId(id: string, cb: (users: Post) => void): void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?;`).get(id));
    }

    static getWithOwner(owner: string, cb: (users: Post[]) => void): void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName} WHERE owner = ?;`).all(owner));
    }

    static getAll(cb: (users: Post[]) => void): void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName}`).all());
    }
}