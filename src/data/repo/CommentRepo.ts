import DBTools from "../DBTools";


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
            DBTools.createIndex(db, this.tableName, "postId");
        });
    }

    private static stm = {

        insert: undefined,
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (id, who, postId, msg) VALUES (?, ?, ?, ?)`);

    }
}