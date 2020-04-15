import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Comment from "../../data/model/Comment";

export default class CommentValidationMiddleware extends BaseValidationMiddaleware {

    static get yech() {
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
}