
import sqlite3 from 'sqlite3';


import UserRepo from "./UserRepo"
import FollowRepo from "./FollowRepo"
import PostRepo from "./PostRepo"
import HashtagRepo from './HashtagRepo';


export default class DB {

    private static fileName = "./data/main.db"

    private static db;

    public static init() {

        this.db = new (sqlite3.verbose()).Database(this.fileName, err => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Successful connection to the database '${this.fileName}'`);
            UserRepo.init(this.db)
            FollowRepo.init(this.db)
            PostRepo.init(this.db)
            HashtagRepo.init(this.db)
        });
    }

    public static backup() {
        // TODO and backup route for admin
    }

    public static adminQuery(query: string, cb: (result) => void): void{
        this.db.getall(query)
    }

}