import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Comment from "../../data/model/Comment";
import Post from "../../data/model/Post";

export default class CommentValidationMiddleware extends BaseValidationMiddaleware {

    static get newComment() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Post.joi.id,
                    msg: Comment.joi.msg,
                }
            })
        }
    }

    static get deleteComment() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    commentId: Comment.joi.id,
                }
            })
        }
    }

    static get getCommentsByPostWithOffset() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Post.joi.id,
                    offset: super.globalJois.offset
                }
            })
        }
    }

    static get countCommentsByPost() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Post.joi.id,
                }
            })
        }
    }
}