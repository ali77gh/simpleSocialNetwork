
import sqlite3 from 'sqlite3';


import UserRepo from "./repo/UserRepo"
import FollowRepo from "./repo/FollowRepo"
import PostRepo from "./repo/PostRepo"
import HashtagRepo from './repo/HashtagRepo';
import LikeRepo from './repo/LikeRepo';
import CommentRepo from './repo/CommentRepo';


export default class DB {

    private static fileName = "./data/main.db"

    private static db;

    public static init() {

        this.db = new (sqlite3.verbose()).Database(this.fileName, err => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Successful connection to the database '${this.fileName}'`);

            // enable foreign key Constraints
            this.db.run("PRAGMA foreign_keys = ON;", (err) => {
                if (err) return console.log(err);
                UserRepo.init(this.db);
                PostRepo.init(this.db);
                FollowRepo.init(this.db);
                HashtagRepo.init(this.db);
                LikeRepo.init(this.db);
                CommentRepo.init(this.db);
            })
            
        });
    }

}