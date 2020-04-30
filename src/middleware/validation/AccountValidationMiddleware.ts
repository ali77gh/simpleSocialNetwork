
import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import User from "../../data/model/User";

export default class AccountValidationMiddleware extends BaseValidationMiddaleware {

    static get signup() {
        return super.generateMiddleware({
            body: {
                email: User.joi.email,
                username: User.joi.username,
                password: User.joi.password,
                fullName: User.joi.fullName,
                bio: User.joi.bio
            }
        })
    }
    static get login() {
        return super.generateMiddleware({
            body: {
                username: User.joi.username,
                password: User.joi.password
            }
        })
    }
    static get editUsername() {
        return super.generateMiddleware({
            body: {
                newUsername: User.joi.username
            }
        })
    }
    static get editFullName() {
        return super.generateMiddleware({
            body: {
                newFullName: User.joi.fullName
            }
        })
    }
    static get editBio() {
        return super.generateMiddleware({
            body: {
                newBio: User.joi.bio
            }
        })
    }
    static get editPassword() {
        return super.generateMiddleware({
            body: {
                oldPassword: User.joi.password,
                newPassword: User.joi.password
            }
        })
    }
    static get getAccountInfo() {
        return super.generateMiddleware({
            param: {
                username: User.joi.username
            }
        })

    }
    static get justUsername() {
        return super.generateMiddleware({
            body: {
                username: User.joi.username,
            }
        })

    }
    static get searchByUsername() {
        return super.generateMiddleware({
            body: {
                username: User.joi.fullName, // space allowed in searching
                offset: BaseValidationMiddaleware.globalJois.offset,
            }
        })
    }
}