import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/LikeValidationMiddleware"
import LikeRepo from "../data/repo/LikeRepo";
import Like from "../data/model/Like";
import Config from "../Config";

export default class LikeController {

    public static init(app) {

        let baseController = new BaseController(app, "/like");

        // like CRUD
        baseController.post("/newLike", true, ValidationMiddaleware.newLike, this.newLike)
        baseController.post("/deleteLike", true, ValidationMiddaleware.deleteLike, this.deleteLike)
        baseController.post("/getLikesByPostOffset", false, ValidationMiddaleware.getLikesByPostOffset, this.getLikesByPostOffset)
        baseController.post("/countLikesByPost", false, ValidationMiddaleware.countLikesByPost, this.countLikesByPost)
    }

    private static newLike(req, res) {
        req.body.who = req.user.username;
        LikeRepo.newLike(Like.parse(req.body), (err) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send()
        })
    }

    private static deleteLike(req, res) {
        req.body.who = req.user.username;
        LikeRepo.deleteLike(Like.parse(req.body), (err) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send()
        })
    }

    private static getLikesByPostOffset(req, res) {
        req.body.offset = (parseInt(req.body.offset)-1) * Config.limits.getLikesByPostOffset;//oldest first
        LikeRepo.getLikesByPostOffset(req.body.postId,req.body.offset, (err,usernames:string[]) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(usernames)
        })
    }

    private static countLikesByPost(req, res) {
        LikeRepo.countLikesByPost(req.body.postId, (err, count: number) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send(count.toString())
        })
    }
}