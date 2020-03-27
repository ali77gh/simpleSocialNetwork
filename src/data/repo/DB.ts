
import Database from 'better-sqlite3';


import UserRepo from "./UserRepo"
import FollowRepo from "./FollowRepo"
import PostRepo from "./PostRepo"
import HashtagRepo from './HashtagRepo';


export default class DB{

    private static fileName = "./database.db"

    private static db;

    public static init() {
        
        this.db = new Database(this.fileName, { verbose: console.log });

        UserRepo.init(this.db)
        FollowRepo.init(this.db)
        PostRepo.init(this.db)
        HashtagRepo.init(this.db)
        //init more tables|repos here
    }

    public static backup() {
        // TODO and backup route for admin
    }


}