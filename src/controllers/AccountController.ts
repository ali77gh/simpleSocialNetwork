import bcrypt from "bcrypt";

import ValidationMiddaleware from "./../middleware/validation/AccountValidationMiddleware"

import User from "../data/model/User";
import UserRepo from "../data/repo/UserRepo";
import BaseController from "./BaseController";
import JWT from "../middleware/AuthMiddleware";


export default class AccountController extends BaseController {

    public static init(app) {
        super.init(app, "/account")

        this.post("/signup", false, ValidationMiddaleware.signup, this.signUp)

        this.post("/login", false, ValidationMiddaleware.login, this.login)

        this.post("/editUsername", true, ValidationMiddaleware.editUsername, this.editUsername)

        this.post("/editFullName", true, ValidationMiddaleware.editFullName, this.editFullName)

        this.post("/editBio", true, ValidationMiddaleware.editBio, this.editBio)

        this.post("/editPassword", true, ValidationMiddaleware.editPassword, this.editPassword)

        this.post("/getAccountInfo/:username", false, ValidationMiddaleware.getAccountInfo, this.getAccountInfo)


    }

    private static signUp(req, res) {

        let user: User = User.parse(req.body)

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
                        let token = JWT.generateToken(req.body.username)
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

    private static editUsername(req, res) {


        try {
            UserRepo.updateUsername(req.user.username, req.body.newUsername)
            res.status(200).send({ msg: "successfully edited" })
        } catch (e) {
            res.status(500).send({ err: e.message })
        }

    }

    private static editFullName(req, res) {

        try {
            UserRepo.updateFullName(req.body.email, req.body.newFullName)
            res.status(200).send({ msg: "successfully added" })
        } catch (e) {
            res.status(500).send({ err: e.message })
        }
    }

    private static editBio(req, res) {

        try {
            UserRepo.updateUsername(req.body.email, req.body.newBio)
            res.status(200).send({ msg: "successfully added" })
        } catch (e) {
            res.status(500).send({ err: e.message })
        }
    }

    private static getAccountInfo(req, res) {

        UserRepo.getWithUsername(req.params.username, (user: User) => {
            if (user) {
                user.hashpass = undefined
                res.status(200).send(user);
            }

            else
                res.status(404).send({ err: "user not found" })
        })
    }

    private static editPassword(req, res) {
        let username = req.user.username;
        let oldPassword = req.body.oldPassword;
        let newpassword = req.body.newPassword;

        UserRepo.getHashpassByUsername(username, (hashpass) => {

            if (hashpass) {
                bcrypt.compare(oldPassword, hashpass, (err: Error, same: boolean) => {

                    if (err) return res.status(500).send({ err: err.message })

                    if (same) {
                        let newHashPass = bcrypt.hashSync(newpassword, 10);
                        UserRepo.updatePassword(username, newHashPass)
                        res.status(200).send({msg: "password changed successfully"});
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
}