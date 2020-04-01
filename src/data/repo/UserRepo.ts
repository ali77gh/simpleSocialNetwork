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
            email             text not null UNIQUE,
            username          text not null UNIQUE,
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

    static updateUsername(username: string, newUsername: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET username = ? 
            WHERE username = ?;
            `).run(newUsername,username)
    }

    static updateFullName(username: string, newFullName: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET fullname = ? 
            WHERE username = ?;
            `).run(newFullName,username)
    }

    static updateBio(username: string, newBio: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET bio = ? 
            WHERE username = ?;
            `).run(newBio, username);
    }

    static updatePassword(username: string, newHashPass: string): void {
        this.db.prepare(`UPDATE ${this.tableName} 
            SET hashpass = ? 
            WHERE username = ?;
            `).run(newHashPass, username);
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

    static getHashpassByUsername(username: string, cb: (hashpass: string) => void): void {
        let user: User = this.db.prepare(`SELECT hashpass FROM ${this.tableName} WHERE username = ?;`).get(username);

        if(!user) return cb(undefined)
        cb(user.hashpass);
    }

    static get NOT_EXIST() { return 0 }
    static get EMAIL_EXIST() { return 1 }
    static get USERNAME_EXIST() { return 2 }
    static get BOTH_EXIST() { return 3 }
    static checkExist(email: string,username: string, cb: (existState: number) => void) {
        let users: User[] = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE username = ? or email = ?;`).all(username,email);
        
        let res = 0;
         
        for (let user of users)
            if (user.email === email)
                res += this.EMAIL_EXIST;
        
        for (let user of users)
            if (user.username === username)
                res += this.USERNAME_EXIST;
        
        cb(res) ;
    }

    static getAll(cb: (users: User[]) => void) :void {
        cb(this.db.prepare(`SELECT * FROM ${this.tableName}`).all());
    }
}