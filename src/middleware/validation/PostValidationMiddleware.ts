
import BaseValidationMiddaleware from "./BaseValidationMiddleware"
import User from "../../data/model/User";

export default class PostValidationMiddleware extends BaseValidationMiddaleware {


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

   
    static get signup() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._signup_B, null, null
            )
        }
    }
   
}