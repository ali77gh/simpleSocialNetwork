import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Hashtag from "../../data/model/Hashtag";

export default class HashtagValidationMiddleware extends BaseValidationMiddaleware {

    static get signup() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    email: Hashtag.joi.email,
                    username: Hashtag.joi.username,
                    password: Hashtag.joi.password,
                    fullName: Hashtag.joi.fullName,
                    bio: Hashtag.joi.bio
                }
            })
        }
    }
}