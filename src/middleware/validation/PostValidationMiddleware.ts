
import BaseValidationMiddaleware from "./BaseValidationMiddleware"
import Post from "../../data/model/Post";
import User from "../../data/model/User";

export default class PostValidationMiddleware extends BaseValidationMiddaleware {

    static get newPost() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    title: Post.joi.title,
                    content: Post.joi.content,
                }
            })
        }
    }
    static get editTitle() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    id: Post.joi.id,
                    newTitle: Post.joi.title,
                }
            })
        }
    }
    static get editContent() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    id: Post.joi.id,
                    newContent: Post.joi.content,
                }
            })
        }
    }
    static get getPost() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                param: {
                    postId: Post.joi.id,
                }
            })
        }
    }
    static get deletePost() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Post.joi.id,
                }
            })
        }
    }
    static get getSomeonesPosts() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: User.joi.username,
                    offset: BaseValidationMiddaleware.globalJois.offset,
                }
            })
        }
    }
    static get countSomeonePosts() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: User.joi.username,
                }
            })
        }
    }
    static get getMyWallWithOffset() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    offset: BaseValidationMiddaleware.globalJois.offset
                }
            })
        }
    }
}