
import Database from 'better-sqlite3';


import UserRepo from "./UserRepo"
import FollowRepo from "./FollowRepo"
import PostRepo from "./PostRepo"


export default class DB{

    private static fileName = "./database.db"

    private static db;

    public static userRepo;
    public static followRepo;
    public static postRepo;

    public static init() {
        
        this.db = new Database(this.fileName, { verbose: console.log });

        UserRepo.init(this.db)
        FollowRepo.init(this.db)
        PostRepo.init(this.db)

        this.userRepo = UserRepo
        this.followRepo = FollowRepo
        this.postRepo = PostRepo
    }


}