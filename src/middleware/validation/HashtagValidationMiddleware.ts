import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Hashtag from "../../data/model/Hashtag";
import Post from "../../data/model/Post";
import Joi from "joi"

export default class HashtagValidationMiddleware extends BaseValidationMiddaleware {

    static get addHashtags() {
        return super.generateMiddleware({
            body: {
                postId: Post.joi.id,
                hashtagNames: Joi.array().items(Hashtag.joi.hashtagName).required(),
            }
        })
    }

    static get deleteHashtags() {
        return super.generateMiddleware({
            body: {
                postId: Post.joi.id,
                hashtagNames: Joi.array().items(Hashtag.joi.hashtagName).required(),
            }
        })
    }

    static get getPostHashtags() {
        return super.generateMiddleware({
            body: {
                postId: Post.joi.id,
            }
        })
    }

    static get getHashtagPostsWithOffset() {
        return super.generateMiddleware({
            body: {
                hashtagName: Hashtag.joi.hashtagName,
                offset: super.globalJois.offset
            }
        })
    }

    static get countHashtagPosts() {
        return super.generateMiddleware({
            body: {
                hashtagName: Hashtag.joi.hashtagName,
            }
        })
    }

    static get searchHashtagByName() {
        return super.generateMiddleware({
            body: {
                hashtagName: Hashtag.joi.hashtagName,
            }
        })
    }
}