import BaseController from "./BaseController";
import ValidationMiddaleware from "./../middleware/validation/HashtagValidationMiddleware"
import PostRepo from "../data/repo/PostRepo";
import Post from "../data/model/Post";
import HashtagRepo from "../data/repo/HashtagRepo";
import { string } from "joi";
import Config from "../Config";

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

        // this line is for improving performance
        // reject without run queries ;)
        if (req.body.hashtagNames.length > Config.hashtagPerPostLimit) {
            return res.status(400).send({ err: `post can't have more then ${Config.hashtagPerPostLimit} hashtags` })
        }
        

        //check if user is owner
        PostRepo.getWithId(req.body.postId, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })


            if (post.owner === req.user.username) {
                // user is owner
                // check if hash tags not crossing limits
                HashtagRepo.countPostHashtags(req.body.postId, (err, count: string) => {
                    if (err) return res.status(500).send({ err: err })

                    if (parseInt(count) + req.body.hashtagNames.length > Config.hashtagPerPostLimit) {
                        //user is crossing limits
                        return res.status(400).send({ err: `post can't have more then ${Config.hashtagPerPostLimit} hashtags` })
                    } else {
                        //user is not crossing limits
                        HashtagRepo.addHashtags(req.body.postId, req.body.hashtagNames, (err) => {

                            if (err) return res.status(500).send({ err: err })
                            res.status(200).send()
                        })
                    }
                })

            } else {
                //user is not owner
                res.status(403).send({ err: "post is not yours :(" })
            }
        })
    }
    
    private static deleteHashtags(req, res) {

        // this line is for improving performance
        // reject without run queries ;)
        if (req.body.hashtagNames.length > Config.hashtagPerPostLimit) {
            return res.status(400).send({ err: `you can't delete more then ${Config.hashtagPerPostLimit} hashtags` })
        }

        //check if user is owner
        PostRepo.getWithId(req.body.postId, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })

            if (post.owner === req.user.username) {
                //user is owner
                HashtagRepo.removeHashtags(req.body.postId,req.body.hashtagNames, (err) => {
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
        HashtagRepo.getPostHashtags(req.body.postId, (err,hashtags:string[]) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(hashtags)
        })
    }
    
    private static getHashtagPostsWithOffset(req, res) {

        // newer first
        // so start counting
        HashtagRepo.countHashtagPosts(req.body.hashtagName, (err:string, count: string) => {
            if (err) return res.status(500).send({ err: err })

            // calculate new offset
            let offset = parseInt(count) - (parseInt(req.body.offset) * Config.limits.getHashtagPosts);

            HashtagRepo.getHashtagPostsWithOffset(req.body.hashtagName, offset, (err, posts: string[]) => {
                if (err) return res.status(500).send({ err: err })
                res.status(200).send(posts.reverse())// finally reverse (because newer first)
            })
        })

        
    }
    private static countHashtagPosts(req, res) {
        HashtagRepo.countHashtagPosts(req.body.hashtagName, (err, count) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(count.toString())
        })
    }
    private static searchHashtagByName(req, res) {
        HashtagRepo.searchHashtagByName(req.body.hashtagName, (err, hashtags: string[]) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(hashtags)
        })
    }
}