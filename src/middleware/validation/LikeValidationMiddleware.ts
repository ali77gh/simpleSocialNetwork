import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Like from "../../data/model/Like";

export default class LikeValidationMiddleware extends BaseValidationMiddaleware {

    static get signup() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    email: Like.joi.email,
                    username: Like.joi.username,
                    password: Like.joi.password,
                    fullName: Like.joi.fullName,
                    bio: Like.joi.bio
                }
            })
        }
    }
}