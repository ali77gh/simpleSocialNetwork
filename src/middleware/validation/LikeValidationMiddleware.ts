import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Like from "../../data/model/Like";

export default class LikeValidationMiddleware extends BaseValidationMiddaleware {

    static get newLike() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Like.joi.postID,
                }
            })
        }
    }

    static get deleteLike() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Like.joi.postID,
                }
            })
        }
    }

    static get getLikesByPostOffset() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Like.joi.postID,
                    offset:super.globalJois.offset
                }
            })
        }
    }

    static get countLikesByPost() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Like.joi.postID,
                }
            })
        }
    }
}