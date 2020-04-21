import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/PostValidationMiddleware"
import PostRepo from "../data/repo/PostRepo"
import Post from "../data/model/Post"
import { number, string } from "joi"
import Config from "../Config"

export default class PostController {

    public static init(app) {

        let baseController = new BaseController(app, "/post")

        // post CRUD
        baseController.post("/newPost", true, ValidationMiddaleware.newPost, this.newPost)
        baseController.post("/editTitle", true, ValidationMiddaleware.editTitle, this.editTitle)
        baseController.post("/editContent", true, ValidationMiddaleware.editContent, this.editContent)
        baseController.post("/getpost/:postId", false, ValidationMiddaleware.getPost, this.getPost)
        baseController.post("/deletePost", true, ValidationMiddaleware.deletePost, this.deletePost)
        baseController.post("/getSomeOnesPosts", false, ValidationMiddaleware.getSomeonesPosts, this.getSomeonesPosts)
        baseController.post("/countSomeOnesPosts", false, ValidationMiddaleware.countSomeonePosts, this.countSomeonesPosts)
        baseController.post("/getMyWallWithOffset", true, ValidationMiddaleware.getMyWallWithOffset, this.getMyWallWithOffset)
        baseController.post("/countMyWall", true, ValidationMiddaleware.noValidation, this.countMyWall)
    }


    private static newPost(req, res) {
        req.body.owner = req.user.username
        PostRepo.add(Post.parse(req.body), (err) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send()
        })
    }

    private static editTitle(req, res) {

        // check user is owner
        PostRepo.getWithId(req.body.id, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })

            if (post.owner === req.user.username) {
                // user is owner
                PostRepo.updateTitle(req.body.id, req.body.newTitle, (err) => {
                    if (err) return res.status(500).send({ err: err })
                    return res.status(200).send()
                })
            } else {
                // usern is not owner
                return res.status(403).send({ err: "you are not the owner of this post" })
            }

        })

    }

    private static editContent(req, res) {

        // check user is owner
        PostRepo.getWithId(req.body.id, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })

            if (post.owner === req.user.username) {
                // user is owner
                PostRepo.updateContent(req.body.id, req.body.newContent, (err) => {
                    if (err) return res.status(500).send({ err: err })
                    res.status(200).send()
                })
            } else {
                // usern is not owner
                return res.status(403).send({ err: "you are not the owner of this post" })
            }
        })

    }

    private static getPost(req, res) {
        PostRepo.getWithId(req.params.postId, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(post)
        })
    }

    private static deletePost(req, res) {

        // check user is owner
        PostRepo.getWithId(req.body.postId, (err, post: Post) => {
            if (err) return res.status(500).send({ err: err })

            if (post.owner === req.user.username) {
                // user is owner
                PostRepo.delete(req.body.postId, (err) => {
                    if (err) return res.status(500).send({ err: err })
                    res.status(200).send()
                })
            } else {
                // usern is not owner
                return res.status(403).send({ err: "you are not the owner of this post" })
            }
        })

    }

    private static getSomeonesPosts(req, res) {

        // newer first
        // so start counting
        PostRepo.countUserPosts(req.body.username, (err, postsCount: string) => {
            if (err) return res.status(500).send({ err: err })

            // calculate new offset
            let offset = parseInt(postsCount) - (parseInt(req.body.offset) * Config.limits.getPostWithOwner);

            PostRepo.getWithOwnerWithOffset(req.body.username, offset, (err, posts: Post[]) => {
                if (err) return res.status(500).send({ err: err })
                res.status(200).send(posts.reverse())// finally reverse (because newer first)
            })
        })
    }

    private static countSomeonesPosts(req, res) {
        PostRepo.countUserPosts(req.body.username, (err, posts: string) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(posts.toString())
        })
    }

    private static getMyWallWithOffset(req, res) {

        // newer first
        // so start counting
        PostRepo.countWall(req.user.username, (err, postsCount: string) => {
            if (err) return res.status(500).send({ err: err })

            // calculate new offset
            let offset = parseInt(postsCount) - (parseInt(req.body.offset) * Config.limits.getWall);

            PostRepo.getWallWithOffset(req.user.username, offset, (err, posts: Post[]) => {
                if (err) return res.status(500).send({ err: err })
                res.status(200).send(posts.reverse())// finally reverse (because newer first)
            })
        })
    }

    private static countMyWall(req, res) {
        PostRepo.countWall(req.user.username, (err, posts: string) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(posts.toString())
        })
    }
}