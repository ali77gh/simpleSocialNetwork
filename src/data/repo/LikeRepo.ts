import DBTools from "../DBTools";



export default class LikeRepo {

    private static tableName = "like"

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
    }

    private static initStatments() {
        //generate binaries
        this.stm.insert = this.db.prepare(`INSERT INTO ${this.tableName} (who, postId) VALUES (?, ?)`);
        
    }
}