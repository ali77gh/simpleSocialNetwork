import express from 'express';

import DB from "./data/repo/DB"

//controllers
import TestControllers from "./controllers/TestControllers";
import LoggerControllers from "./controllers/LoggerControllers";
import AccountController from "./controllers/AccountController"

//middlewares
import LoggerMiddleware from "./middleware/LoggerMiddleware";
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
    }

    private initRouter(){

        //these routes done without auth
        TestControllers.init(this.app);
        LoggerControllers.init(this.app);
        AccountController.init(this.app);
    }

    private listen(){
        this.app.listen(this.port, () => console.log(`App running on port ${this.port}`))
    }
}

new Main()
