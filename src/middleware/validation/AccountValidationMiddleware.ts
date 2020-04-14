
import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import User from "../../data/model/User";

export default class AccountValidationMiddleware extends BaseValidationMiddaleware {

    static get signup() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    email: User.joi.email,
                    username: User.joi.username,
                    password: User.joi.password,
                    fullName: User.joi.fullName,
                    bio: User.joi.bio
                }
            })
        }
    }
    static get login() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    username: User.joi.username,
                    password: User.joi.password
                }
            })
        }
    }
    static get editUsername() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    newUsername: User.joi.username
                }
            })
        }
    }
    static get editFullName() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    newFullName: User.joi.fullName
                }
            })
        }
    }
    static get editBio() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    newBio: User.joi.bio
                }
            })
        }
    }
    static get editPassword() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    oldPassword: User.joi.password,
                    newPassword: User.joi.password
                }
            })
        }
    }
    static get getAccountInfo() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                param: {
                    username: User.joi.username
                }
            })
        }
    }
    static get justUsername() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    username: User.joi.username,
                }
            })
        }
    }
    static get searchByUsername() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    username: User.joi.fullName, // space allowed in searching
                    offset: BaseValidationMiddaleware.globalJois.offset,
                }
            })
        }
    }
}