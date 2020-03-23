import express from 'express';

//controllers
import TestControllers from "./controllers/TestControllers";
import LoggerControllers from "./controllers/LoggerControllers";

//middlewares
import LoggerMiddleware from "./modules/LoggerMiddleware";


class Main{

    private app
    private port = 3000
    
    constructor(){
        this.app = express()

        //statics
        this.app.use(express.static('public'))

        //middlewares
        this.initMiddlewares()

        //apis
        this.initRouter()

        this.listen()
    }

    private initMiddlewares() {
        
        LoggerMiddleware.init(this.app);
        
    }

    private initRouter(){

        TestControllers.init(this.app);
        LoggerControllers.init(this.app)

    }

    private listen(){
        this.app.listen(this.port, () => console.log(`App running on port ${this.port}`))
    }
}

new Main()