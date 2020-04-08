import bcrypt from "bcrypt";

import ValidationMiddaleware from "./../middleware/validation/AccountValidationMiddleware"

import User from "../data/model/User";
import UserRepo from "../data/repo/UserRepo";
import BaseController from "./BaseController";
import JWT from "../middleware/AuthMiddleware";


export default class AccountController  {

    public static init(app) {

        let baseController = new BaseController(app,"/account")
        
        baseController.post("/signup", false, ValidationMiddaleware.signup, this.signUp)

        baseController.post("/login", false, ValidationMiddaleware.login, this.login)

        baseController.post("/editUsername", true, ValidationMiddaleware.editUsername, this.editUsername)

        baseController.post("/editFullName", true, ValidationMiddaleware.editFullName, this.editFullName)

        baseController.post("/editBio", true, ValidationMiddaleware.editBio, this.editBio)

        baseController.post("/editPassword", true, ValidationMiddaleware.editPassword, this.editPassword)

        baseController.post("/getAccountInfo/:username", false, ValidationMiddaleware.getAccountInfo, this.getAccountInfo)

        baseController.post("/logout", true, ValidationMiddaleware.noValidation, this.logout)
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
                    UserRepo.add(user, (err) => {
                        if (err) res.status(500).send({ err: err })
                        res.status(200).send("sign up done successfully");
                    });
                    break
            }
        })
    }

    private static login(req, res) {

        UserRepo.getHashpassByUsername(req.body.username, (err, hashpassDb) => {
            
            if (err) return res.status(500).send({ msg: err });

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
        UserRepo.updateUsername(req.user.username, req.body.newUsername, (err) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send({ msg: "successfully" })
        })
    }

    private static editFullName(req, res) {
        UserRepo.updateFullName(req.user.username, req.body.newFullName, (err) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send({ msg: "successfully" })
        })
    }

    private static editBio(req, res) {
        UserRepo.updateBio(req.user.username, req.body.newBio, (err) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send({ msg: "successfully" })
        })
    }

    private static getAccountInfo(req, res) {

        UserRepo.getWithUsername(req.params.username, (err: string, user: User) => {
            if (err)
                return res.status(500).send({ err: err })
            if (!user) 
                return res.status(404).send({ err: "user not found" })
                
            res.status(200).send(user);
        })
    }

    private static editPassword(req, res) {
        let username = req.user.username;
        let oldPassword = req.body.oldPassword;
        let newpassword = req.body.newPassword;

        UserRepo.getHashpassByUsername(username, (err,hashpass) => {

            if (err) return res.status(500).send({ msg: err });

            if (hashpass) {
                bcrypt.compare(oldPassword, hashpass, (err: Error, same: boolean) => {

                    if (err) return res.status(500).send({ err: err.message })

                    if (same) {
                        let newHashPass = bcrypt.hashSync(newpassword, 10);
                        UserRepo.updatePassword(username, newHashPass, (err) => {
                            if (err) return res.status(500).send({ msg: err });
                            res.status(200).send({ msg: "password changed successfully" });
                        })
                        
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

    private static logout(req, res) {
        const token = req.headers["x-access-token"] || req.headers["x-auth-token"];
        JWT.logout(token)
        res.status(200).send({ msg: "logout successfully" })
    }
}