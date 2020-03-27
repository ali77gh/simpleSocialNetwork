import jwt from "jsonwebtoken";
import fs from "fs";
import bcrypt from "bcrypt";

import ValidationMiddaleware from "./../middleware/validation/AccountValidationMiddleware"

import User from "../data/model/User";
import UserRepo from "../data/repo/UserRepo";
import BaseController from "./BaseController";


export default class AccountController extends BaseController {

    public static init(app) {
        super.init(app,"/account")

        this.post("/signup", false, ValidationMiddaleware.signup, this.signUp)

        this.post("/login", false, ValidationMiddaleware.login, this.login)

    }

    private static signUp(req, res) {
        
        let user : User = User.parse(req.body)

        UserRepo.checkExist(user.email, user.username, (existState) => {
            switch (existState) {
                case UserRepo.EMAIL_EXIST:
                    res.status(403).send("email is taken")
                    break

                case UserRepo.USERNAME_EXIST:
                    res.status(403).send("username is taken")
                    break

                case UserRepo.BOTH_EXIST:
                    res.status(403).send("email and username is taken")
                    break

                case UserRepo.NOT_EXIST:
                    UserRepo.add(user);
                    res.status(200).send("sign up done successfully");
                    break
            }
        })
    }

    private static login(req, res) {

        UserRepo.getHashpassByUsername(req.body.username, (hashpassDb) => {

            if (hashpassDb) {
                bcrypt.compare(req.body.password, hashpassDb, (err: Error, same: boolean) => {

                    if (err) return res.status(500).send({ err: err.message })

                    if (same) {
                        let token = AccountController.generateToken(req.body.username)
                        res.status(200)
                            .header("x-auth-token", token)
                            .cookie("x-auth-token", token)
                            .send({ "x-auth-token": token })
                    } else {
                        setTimeout(() => {
                            res.status(400)
                                .send({ err: "password is not correct" })
                        }, 2000)
                    }
                })


            } else {
                res.status(404).send("username not found")
            }

        })
    }

    private static generateToken(userUsername: string): string {
        let key = fs.readFileSync("jwt.key")
        const token = jwt.sign({ username: userUsername }, key);
        return token;
    }
}