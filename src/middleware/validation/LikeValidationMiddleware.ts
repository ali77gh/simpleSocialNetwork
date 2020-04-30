import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Like from "../../data/model/Like";

export default class LikeValidationMiddleware extends BaseValidationMiddaleware {

    static get newLike() {
        return super.generateMiddleware({
            body: {
                postId: Like.joi.postID,
            }
        })
    }

    static get deleteLike() {
        return super.generateMiddleware({
            body: {
                postId: Like.joi.postID,
            }
        })
    }


    static get getLikesByPostOffset() {
        return super.generateMiddleware({
            body: {
                postId: Like.joi.postID,
                offset: super.globalJois.offset
            }
        })
    }


    static get countLikesByPost() {
        return super.generateMiddleware({
            body: {
                postId: Like.joi.postID,
            }
        })
    }
}
