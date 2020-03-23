import User from "../model/User";


//                                          sql injection note

// SQLite protects you against SQL injections if you specify user - supplied data as part of the params rather than stringing together an SQL query:
// BAD: db.prepare("INSERT INTO foo VALUES(" + variable + ")");
// GOOD: db.prepare("INSERT INTO foo VALUES (?)", variable);
// By using the placeholder ?, SQLite automatically treats the data as input data and it does not interfere with parsing the actual SQL statement.

export default class UserRepo {

    private static tableName = "user"

    private static db;

    static init(db) {
        
        this.db = db;

        this.db.exec(`
        create table IF NOT EXISTS ${this.tableName} (
            email             text not null,
            username          text not null,
            hashpass          text not null,
            fullname          text not null,
            bio               text not null
        );
        `);
    }

    static add(user: User): void {

        const insert = this.db.prepare(`INSERT INTO ${this.tableName} 
        (email, username, hashpass, fullname, bio) VALUES (?, ?, ?, ?, ?)`);

        insert.run(user.email, user.username, user.hashpass, user.fullName, user.bio)
       
    }

    static updateBio(email: string, newBio:string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET bio = ? 
            WHERE email = ?;
            `).run(newBio, email);
    }

    static updateUsername(email: string, newUsername: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET username = ? 
            WHERE email = ?;
            `).run(newUsername,email)
    }

    static updateFullName(email: string, newFullName: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET fullname = ? 
            WHERE email = ?;
            `).run(newFullName,email)
    }

    static delete(email: string): void {
        this.db.prepare(`DELETE FROM ${this.tableName} WHERE email = ?;`).run(email);
    }

    static getWithEmail(email: string, cb: (users: User) => void) :void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName} WHERE email = ?;`).get(email));
    }

    static getWithUsername(username: string, cb: (users: User) => void): void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName} WHERE username = ?;`).get(username));
    }

    static getAll(cb: (users: User[]) => void) :void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName}`).all());
    }
}