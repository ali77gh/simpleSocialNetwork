import BaseController from "./BaseController";
import ValidationMiddaleware from "./../middleware/validation/HashtagValidationMiddleware"
import PostRepo from "../data/repo/PostRepo";
import Post from "../data/model/Post";
import HashtagRepo from "../data/repo/HashtagRepo";

export default class HashtagController {

    public static init(app) {

        let baseController = new BaseController(app, "/hashtag")


        // hashtag CRUD
        baseController.post("/addHashtags", true, ValidationMiddaleware.addHashtags, this.addHashtags)
        baseController.post("/deleteHashtags", true, ValidationMiddaleware.deleteHashtags, this.deleteHashtags)
        baseController.post("/getPostHashtags", false, ValidationMiddaleware.getPostHashtags, this.getPostHashtags)
        baseController.post("/getHashtagPostsWithOffset", false, ValidationMiddaleware.getHashtagPostsWithOffset, this.getHashtagPostsWithOffset)
        baseController.post("/countHashtagPosts", false, ValidationMiddaleware.countHashtagPosts, this.countHashtagPosts)
        baseController.post("/searchHashtagByName", false, ValidationMiddaleware.searchHashtagByName, this.searchHashtagByName)
    }

    private static addHashtags(req, res) {
        //check if user is owner
        PostRepo.getWithId(req.body.postId, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })

            if (post.owner === req.user.username) {
                //user is owner
                HashtagRepo.addHashtags(req.body.postId,req.hashtagNames, (err) => {
                    if (err) return res.status(500).send({ err: err })
                    res.status(200).send()
                })

            } else {
                //user is not owner
                res.status(403).send({ err: "post is not yours :(" })
            }
        })
    }
    private static deleteHashtags(req, res) {
        //check if user is owner
        PostRepo.getWithId(req.body.postId, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })

            if (post.owner === req.user.username) {
                //user is owner
                HashtagRepo.removeHashtags(req.body.postId,req.hashtagNames, (err) => {
                    if (err) return res.status(500).send({ err: err })
                    res.status(200).send()
                })

            } else {
                //user is not owner
                res.status(403).send({ err: "post is not yours :(" })
            }
        })
    }
    private static getPostHashtags(req, res) {
        HashtagRepo.getPostHashtags(req.postId, (err,hashtags:string[]) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(hashtags)
        })
    }
    private static getHashtagPostsWithOffset(req, res) {
        HashtagRepo.getHashtagPostsWithOffset(req.hashtagName,req.offset, (err, posts: string[]) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(posts)
        })
    }
    private static countHashtagPosts(req, res) {
        HashtagRepo.countHashtagPosts(req.hashtagName, (err, count) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(count)
        })
    }
    private static searchHashtagByName(req, res) {
        HashtagRepo.searchHashtagByName(req.hashtagName, (err, hashtags: string[]) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(hashtags)
        })
    }
}