import BaseController from "./BaseController";
import AccountValidationMiddleware from "./../middleware/validation/AccountValidationMiddleware"

import fs from "fs";

export default class AdminController  {

    private static logFile = "./data/req.log" 
    private static databaseFile = "./data/main.db"

    public static init(app) {

        let baseController = new BaseController(app, "/admin")
        
        baseController.post("/getLogs", true, AccountValidationMiddleware.noValidation, this.getLogs)
        baseController.post("/clearLogs", true, AccountValidationMiddleware.noValidation, this.clearLogs)
        baseController.post("/backupDatabase", true, AccountValidationMiddleware.noValidation, this.backupDatabase)
        
        
    }

    private static getLogs(req, res) {

        if (req.user.username === "admin") {
            fs.createReadStream(AdminController.logFile).pipe(res);
        }
        //have no else ;)
    }

    private static backupDatabase(req, res) {

        if (req.user.username === "admin") {
            fs.createReadStream(AdminController.databaseFile).pipe(res);
        }
        //have no else ;)
    }

    private static clearLogs(req, res) {

        if (req.user.username === "admin") { 
            fs.unlink(AdminController.logFile, (err) => {
                if (err) return res.status(500).send(err);
                res.status(200).send("logs cleared")
            })
        }
    }
}

