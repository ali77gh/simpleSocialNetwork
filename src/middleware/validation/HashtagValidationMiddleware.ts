import BaseValidationMiddaleware from "./BaseValidationMiddleware";
import Hashtag from "../../data/model/Hashtag";
import Post from "../../data/model/Post";
import Joi from "joi"

export default class HashtagValidationMiddleware extends BaseValidationMiddaleware {

    static get addHashtags() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Post.joi.id,
                    hashtagName: Joi.array().items(Hashtag.joi.hashtagName) ,
                }
            })
        }
    }

    static get deleteHashtags() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Post.joi.id,
                    hashtagName: Joi.array().items(Hashtag.joi.hashtagName),
                }
            })
        }
    }

    static get getPostHashtags() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    postId: Post.joi.id,
                }
            })
        }
    }

    static get getHashtagPostsWithOffset() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    hashtagName: Hashtag.joi.hashtagName,
                    offset: super.globalJois.offset
                }
            })
        }
    }

    static get countHashtagPosts() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    hashtagName: Hashtag.joi.hashtagName,
                }
            })
        }
    }

    static get searchHashtagByName() {
        return (req, res, next) => {
            super.handleError(req, res, next, {
                body: {
                    hashtagName: Hashtag.joi.hashtagName,
                }
            })
        }
    }
}