import bcrypt from "bcrypt";

import ValidationMiddaleware from "./../middleware/validation/AccountValidationMiddleware"

import User from "../data/model/User";
import UserRepo from "../data/repo/UserRepo";
import BaseController from "./BaseController";
import JWT from "../middleware/AuthMiddleware";
import FollowRepo from "../data/repo/FollowRepo";
import Follow from "../data/model/Follow";
import Config from "../Config";


export default class AccountController  {

    public static init(app) {

        let baseController = new BaseController(app, "/account")
        
        // account CRUD
        baseController.post("/signup", false, ValidationMiddaleware.signup, this.signUp)
        baseController.post("/editFullName", true, ValidationMiddaleware.editFullName, this.editFullName)
        baseController.post("/editBio", true, ValidationMiddaleware.editBio, this.editBio)
        baseController.post("/editPassword", true, ValidationMiddaleware.editPassword, this.editPassword)
        baseController.post("/getAccountInfo/:username", false, ValidationMiddaleware.getAccountInfo, this.getAccountInfo)
        baseController.post("/searchByUsername", false, ValidationMiddaleware.searchByUsername, this.searchByUsername)

        // Security actoins
        baseController.post("/logout", true, ValidationMiddaleware.noValidation, this.logout)
        baseController.post("/login", false, ValidationMiddaleware.login, this.login)
        // TODO verify email
        // TODO forgot password with email

        // follow CRUD
        baseController.post("/follow", true, ValidationMiddaleware.justUsername, this.follow)
        baseController.post("/unfollow", true, ValidationMiddaleware.justUsername, this.unfollow)
        baseController.post("/getFollowers", false, ValidationMiddaleware.justUsername, this.getFollowers)
        baseController.post("/getFollowings", false, ValidationMiddaleware.justUsername, this.getFollowings)
        baseController.post("/countFollowers", false, ValidationMiddaleware.justUsername, this.getFollowersCount)
        baseController.post("/countFollowings", false, ValidationMiddaleware.justUsername, this.getFollowingsCount)
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
                        if (err)  return res.status(500).send({ err: err })
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

    private static editFullName(req, res) {
        UserRepo.updateFullName(req.user.username, req.body.newFullName, (err) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send({ msg: "successfully" })
        })
    }

    private static editBio(req, res) {
        UserRepo.updateBio(req.user.username, req.body.newBio, (err) => {
            if (err) return res.status(500).send({ err: err })
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

    private static searchByUsername(req, res) {
        req.body.offset = parseInt(req.body.offset) * Config.limits.searchByUsername;//oldest first
        UserRepo.searchByUsernameWithOffset(req.body.username, req.body.offset, (err: string, users: string[]) => {
            if (err) return res.status(500).send(err)
            res.status(200).send(users)
        })
    }

    private static follow(req, res) {
        FollowRepo.follow(new Follow(req.user.username, req.body.username), (err) => {
            if (err) return res.status(500).send(err)
            res.status(200).send({msg:"done"})
        })
    }
    private static unfollow(req, res) {
        FollowRepo.unfollow(new Follow(req.user.username, req.body.username), (err) => {
            if (err) return res.status(500).send(err)
            res.status(200).send({ msg: "done" })
        })
    }
    private static getFollowers(req, res) {
        FollowRepo.getFollowersByUsername(req.body.username, (err: string, users: string[]) => {
            if (err) return res.status(500).send(err)
            res.status(200).send(users)
        })
    }
    private static getFollowings(req, res) {
        FollowRepo.getFollowingByUsername(req.body.username, (err: string, users: string[]) => {
            if (err) return res.status(500).send(err)
            res.status(200).send(users)
        })
    }
    private static getFollowersCount(req, res) {
        FollowRepo.getFollowersCountByUsername(req.body.username, (err: string, usersCount: number) => {
            if (err) return res.status(500).send(err)
            res.status(200).send({ usersCount: usersCount })
        })
    }
    private static getFollowingsCount(req, res) {
        FollowRepo.getFollowingCountByUsername(req.body.username, (err: string, usersCount: number) => {
            if (err) return res.status(500).send(err)
            res.status(200).send({ usersCount: usersCount })
        })
    }
}