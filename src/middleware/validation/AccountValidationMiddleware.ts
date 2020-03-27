
import Joi from "joi";
import BaseValidationMiddaleware from "./BaseValidationMiddleware"

export default class AccountValidationMiddleware extends BaseValidationMiddaleware {


    //---------------Naming-----------------
    // _X_Y
    // X api path
    // Y == B => body validation schema
    // Y == H => header validation schema

    private static _signup_B = {
        email: Joi.string().min(5).max(255).required().email(),
        username: Joi.string().min(5).max(255).required().regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
        password: Joi.string().min(8).max(255).required(),
        fullName: Joi.string().min(3).max(255).required(),
        bio: Joi.string().min(3).max(500).required()
    };

    private static _login_B = {
        username: Joi.string().min(5).max(255).required().regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
        password: Joi.string().min(8).max(255).required()
    };

    static get signup() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._signup_B, null
            )
        }
    }
    static get login() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._login_B, null
            )
        }
    }

    
}