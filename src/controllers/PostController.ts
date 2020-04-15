import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/PostValidationMiddleware"
import PostRepo from "../data/repo/PostRepo"
import Post from "../data/model/Post"

export default class PostController{

    public static init(app) {

        let baseController = new BaseController(app, "/post")

        // post CRUD
        baseController.post("/newPost", true, ValidationMiddaleware.newPost, this.newPost)// TODO TEST PLZ
        baseController.post("/editTitle", true, ValidationMiddaleware.editTitle, this.editTitle)// TODO TEST PLZ
        baseController.post("/editContent", true, ValidationMiddaleware.editContent, this.editContent)// TODO TEST PLZ
        baseController.post("/getpost/:postId", false, ValidationMiddaleware.getPost, this.getPost)// TODO TEST PLZ
        baseController.post("/deletePost", true, ValidationMiddaleware.deletePost, this.deletePost)// TODO TEST PLZ
        baseController.post("/getSomeOnesPosts", false, ValidationMiddaleware.getSomeonesPosts, this.getSomeonesPosts)// TODO TEST PLZ
        baseController.post("/countSomeOnesPosts", false, ValidationMiddaleware.countSomeonePosts, this.countSomeonesPosts)// TODO TEST PLZ
        baseController.post("/getMyWallWithOffset", true, ValidationMiddaleware.getMyWallWithOffset, this.getMyWallWithOffset)// TODO TEST PLZ 
        baseController.post("/countMyWall", true, ValidationMiddaleware.noValidation, this.countMyWall)// TODO TEST PLZ
    }


    private static newPost(req, res) {
        PostRepo.add(Post.parse(req.body), (err) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send()   
        })
    }

    private static editTitle(req, res) {
        PostRepo.updateTitle(req.body.id,req.body.newTitle, (err) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send()
        })
    }

    private static editContent(req, res) {
        PostRepo.updateContent(req.body.id, req.body.newContent, (err) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send()
        })
    }

    private static getPost(req, res) {
        PostRepo.getWithId(req.param, (err, post: Post) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send(post)
        })
    }

    private static deletePost(req, res) {
        PostRepo.delete(req.body.id, (err) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send()
        })
    }

    private static getSomeonesPosts(req, res) {
        PostRepo.getWithOwner(req.body.owner, req.body.offset, (err, posts: Post[]) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send(posts)
        })
    }

    private static countSomeonesPosts(req, res) {
        PostRepo.countUserPosts(req.body.owner, (err, posts: number) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send(posts)
        })
    }

    private static getMyWallWithOffset(req, res) {
        PostRepo.getWall(req.user.username,req.body.offset, (err, posts: Post[]) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send(posts)
        })
    }

    private static countMyWall(req, res) {
        PostRepo.countWall(req.user.username, (err, posts: number) => {
            if (err) res.status(500).send({ err: err })
            res.status(200).send(posts)
        })
    }
}