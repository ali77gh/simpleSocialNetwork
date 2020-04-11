
import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import User from "../../data/model/User";

export default class AccountValidationMiddleware extends BaseValidationMiddaleware {


    //---------------Naming-----------------
    // _X_Y
    // X api path
    // Y == "B" => body validation schema
    // Y == "H" => header validation schema
    // Y == "P" => params validation schema
    

    private static _signup_B = {
        email: User.joi.email,
        username: User.joi.username,
        password: User.joi.password,
        fullName: User.joi.fullName,
        bio: User.joi.bio
    };

    private static _login_B = {
        username: User.joi.username,
        password: User.joi.password
    };

    
    private static _editUsername_B = {
        newUsername: User.joi.username
    };

    private static _editFullName_B = {
        newFullName: User.joi.fullName
    };

    private static _editBio_B = {
        newBio: User.joi.bio
    };

    private static _editPassword_B = {
        oldPassword: User.joi.password,
        newPassword: User.joi.password
    };

    private static _justUsername_B = {
        username: User.joi.username,
    };

    private static _searchByUsername_B = {
        username: User.joi.fullName, // space allowed in searching
        offset: BaseValidationMiddaleware.globalJois.offset,
    };


    private static _getAccountInfo_P = {
        username: User.joi.username
    };

    static get signup() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._signup_B, null,null
            )
        }
    }
    static get login() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._login_B, null,null
            )
        }
    }
    static get editUsername() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._editUsername_B, null,null
            )
        }
    }
    static get editFullName() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._editFullName_B, null,null
            )
        }
    }
    static get editBio() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._editBio_B, null,null
            )
        }
    }
    static get editPassword() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._editPassword_B, null, null
            )
        }
    }
    static get getAccountInfo() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                null, null,this._getAccountInfo_P
            )
        }
    }
    static get justUsername() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._justUsername_B, null, null
            )
        }
    }
    static get searchByUsername() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._searchByUsername_B, null, null
            )
        }
    }
    
}