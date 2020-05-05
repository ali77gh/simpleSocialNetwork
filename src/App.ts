import express from 'express';

import DB from "./data/DB";

//controllers
import TestControllers   from "./controllers/TestControllers";
import AccountController from "./controllers/AccountController";
import AdminController   from "./controllers/AdminController";
import PostContoller     from "./controllers/PostController";
import LikeController    from "./controllers/LikeController";
import HashtagController from "./controllers/HashtagController";
import CommentController from "./controllers/CommentController";

//middlewares
import LoggerMiddleware from "./middleware/LoggerMiddleware";
import AuthMiddleware   from "./middleware/AuthMiddleware";
import bodyParser       from "body-parser";
import cors             from 'cors';


class Main{

    private app
    private port = 80
    
    constructor(){
        this.app = express()

        DB.init()
        //statics
        this.app.use(express.static('public'))

        //middlewares
        this.initMiddlewares()

        //apis
        this.initRouter()

        this.listen()
    }

    private initMiddlewares() {
        
        this.app.use(bodyParser.json())
        this.app.use(cors()) // enable cross origin requests
        LoggerMiddleware.init(this.app);
        AuthMiddleware.gcLoop();
    }

    private initRouter(){

        TestControllers.init(this.app);// "/test"
        AccountController.init(this.app);// "/account/*"
        AdminController.init(this.app);// "/admin/*"
        PostContoller.init(this.app);// "/post/*"
        CommentController.init(this.app);// "/comment/*"
        LikeController.init(this.app);// "/like/*"
        HashtagController.init(this.app);// "/hashtag/*"
    }

    private listen(){
        this.app.listen(this.port, () => console.log(`App running on port ${this.port}`))
    }
}

new Main()
