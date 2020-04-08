import express from 'express';

import DB from "./data/repo/DB"

//controllers
import TestControllers from "./controllers/TestControllers";
import AccountController from "./controllers/AccountController"
import AdminController from "./controllers/AdminController"

//middlewares
import LoggerMiddleware from "./middleware/LoggerMiddleware";
import AuthMiddleware from "./middleware/AuthMiddleware"
import bodyParser from "body-parser"


class Main{

    private app
    private port = 3000
    
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
        LoggerMiddleware.init(this.app);
        AuthMiddleware.gcLoop()
    }

    private initRouter(){

        //these routes done without auth
        TestControllers.init(this.app);
        AccountController.init(this.app);
        AdminController.init(this.app)
    }

    private listen(){
        this.app.listen(this.port, () => console.log(`App running on port ${this.port}`))
    }
}

new Main()
