
import BaseValidationMiddaleware from "./BaseValidationMiddleware"
import Post from "../../data/model/Post";
import User from "../../data/model/User";

export default class PostValidationMiddleware extends BaseValidationMiddaleware {

    static get newPost() {
        return super.generateMiddleware({
            body: {
                title: Post.joi.title,
                content: Post.joi.content,
            }
        })
    }
    static get editTitle() {
        return super.generateMiddleware({
            body: {
                id: Post.joi.id,
                newTitle: Post.joi.title,
            }
        })
    }
    static get editContent() {
        return super.generateMiddleware({
            body: {
                id: Post.joi.id,
                newContent: Post.joi.content,
            }
        })
    }
    static get getPost() {
        return super.generateMiddleware({
            param: {
                postId: Post.joi.id,
            }
        })
    }
    static get deletePost() {
        return super.generateMiddleware({
            body: {
                postId: Post.joi.id,
            }
        })
    }
    static get getSomeonesPosts() {
        return super.generateMiddleware({
            body: {
                username: User.joi.username,
                offset: BaseValidationMiddaleware.globalJois.offset,
            }
        })
    }
    static get countSomeonePosts() {
        return super.generateMiddleware({
            body: {
                username: User.joi.username,
            }
        })
    }
    static get getMyWallWithOffset() {
        return super.generateMiddleware({
            body: {
                offset: BaseValidationMiddaleware.globalJois.offset
            }
        })
    }
}