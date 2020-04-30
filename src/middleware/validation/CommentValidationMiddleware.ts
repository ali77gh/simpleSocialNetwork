import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Comment from "../../data/model/Comment";
import Post from "../../data/model/Post";

export default class CommentValidationMiddleware extends BaseValidationMiddaleware {

    static get newComment() {
        return super.generateMiddleware({
            body: {
                postId: Post.joi.id,
                msg: Comment.joi.msg,
            }
        })
    }

    static get deleteComment() {
        return super.generateMiddleware({
            body: {
                commentId: Comment.joi.id,
            }
        })
    }

    static get getCommentsByPostWithOffset() {
        return super.generateMiddleware({
            body: {
                postId: Post.joi.id,
                offset: super.globalJois.offset
            }
        })
    }

    static get countCommentsByPost() {
        return super.generateMiddleware({
            body: {
                postId: Post.joi.id,
            }
        })
    }
}