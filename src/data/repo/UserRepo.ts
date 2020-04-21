import User from "../model/User";
import DBTools from "../DBTools";
import Config from "../../Config";


export default class UserRepo {

    public static get tableName() { return "user" }

    private static db;

    public static init(db) {

        this.db = db;

        this.db.run(`create table IF NOT EXISTS ${this.tableName} (
            email             text not null UNIQUE,
            username          text not null PRIMARY KEY,
            hashpass          text not null,
            fullname          text not null,
            bio               text not null
        );`, (err) => {
            if (err) {
                return console.error(this.tableName + err.message);
            }
            this.initStatments();
            DBTools.createIndex(db,this.tableName, "username");
        });
    }
    // why?
    // see here -> https://www.sqlite.org/c3ref/stmt.html
    private static stm = {

        insert: undefined,
        updateUsername: undefined,
        updateFullName: undefined,
        updateBio: undefined,
        updatePassword: undefined,
        delete: undefined,
        getWithUsername: undefined,
        getHashPass: undefined,
        getAll: undefined,
        checkExist: undefined,
        searchByUsernameWithOffset : undefined
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (email, username, hashpass, fullname, bio) VALUES (?, ?, ?, ?, ?)`);
        this.stm.updateUsername = this.db.prepare(`UPDATE ${this.tableName} SET username = ? WHERE username = ?;`)
        this.stm.updateFullName = this.db.prepare(`UPDATE ${this.tableName} SET fullname = ? WHERE username = ?;`)
        this.stm.updateBio = this.db.prepare(`UPDATE ${this.tableName} SET bio = ? WHERE username = ?;`)
        this.stm.updatePassword = this.db.prepare(`UPDATE ${this.tableName} SET hashpass = ? WHERE username = ?;`)
        this.stm.delete = this.db.prepare(`DELETE FROM ${this.tableName} WHERE email = ?;`)
        this.stm.getWithUsername = this.db.prepare(`SELECT email,username,fullname,bio FROM ${this.tableName} WHERE username = ?;`)
        this.stm.getHashPass = this.db.prepare(`SELECT hashpass FROM ${this.tableName} WHERE username = ?;`)
        this.stm.getAll = this.db.prepare(`SELECT * FROM ${this.tableName}`)
        this.stm.checkExist = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE username = ? or email = ?;`);
        this.stm.searchByUsernameWithOffset = this.db.prepare(`SELECT email,username,fullname,bio from ${this.tableName} WHERE username LIKE ? LIMIT ${Config.limits.searchByUsername} OFFSET ?;`)
    }

    public static add(user: User, finished: (err: string) => void): void {
        this.stm.insert.run([user.email, user.username, user.hashpass, user.fullName, user.bio], (err) => {
            finished(err);
        })
    }

    public static updateFullName(username: string, newFullName: string, finished: (err: string) => void): void {
        this.stm.updateFullName.run([newFullName, username], (err) => {
            finished(err);
        })
    }

    public static updateBio(username: string, newBio: string, finished: (err: string) => void): void {
        this.stm.updateBio.run([newBio, username], (err) => {
            finished(err);
        })
    }

    public static updatePassword(username: string, newHashPass: string, finished: (err: string) => void): void {
        this.stm.updatePassword.run([newHashPass, username], (err) => {
            finished(err);
        })
    }

    public static delete(email: string, finished: (err: string) => void): void {
        this.stm.delete.run([email], (err) => {
            finished(err);
        })
    }

    public static getWithUsername(username: string, finished: (err: string, users: User) => void): void {
        this.stm.getWithUsername.get([username], (err, row) => {
            finished(err, row);
        })
    }

    public static getHashpassByUsername(username: string, cb: (err: string, hashpass: string) => void): void {
        this.stm.getHashPass.get(username, (err, row) => {
            if (err) return cb(err, undefined)

            if (row) cb(err, row.hashpass);
            else cb("not found", undefined);
        });
    }

    public static get NOT_EXIST() { return 0 }
    public static get EMAIL_EXIST() { return 1 }
    public static get USERNAME_EXIST() { return 2 }
    public static get BOTH_EXIST() { return 3 }
    public static checkExist(email: string, username: string, cb: (existState: number) => void) {
        this.stm.checkExist.all([username, email], (err, rows) => {

            if (err) return console.error(err)

            let res = 0;

            for (let user of rows)
                if (user.email === email)
                    res += this.EMAIL_EXIST;

            for (let user of rows)
                if (user.username === username)
                    res += this.USERNAME_EXIST;

            cb(res);
        })
    }

    public static getAll(cb: (err: string, users: User[]) => void): void {
        this.stm.getAll.all([], (err, rows) => {
            if (err) return cb(err, undefined)
            for (let i of rows) i.hashpass = undefined
            cb(err, rows)
        })
    }

    public static searchByUsernameWithOffset(username: string,offset, cb: (err: string, users: string[]) => void): void{
        username = "%" + username.replace(/ /g, "%") + "%";
        this.stm.searchByUsernameWithOffset.all([username,offset], (err, rows) => {
            cb(err,rows)
        })
    }
}