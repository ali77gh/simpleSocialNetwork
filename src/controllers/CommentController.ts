import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/CommentValidationMiddleware"
import CommentRepo from "../data/repo/CommentRepo"
import Comment from "../data/model/Comment"
import Config from "../Config"

export default class CommentController {

    public static init(app) {

        let baseController = new BaseController(app, "/comment")

        // comment CRUD
        baseController.post("/newComment", true, ValidationMiddaleware.newComment, this.newComment)
        baseController.post("/deleteComment", true, ValidationMiddaleware.deleteComment, this.deleteComment)
        baseController.post("/getCommentsByPostWithOffset", false, ValidationMiddaleware.getCommentsByPostWithOffset, this.getCommentsByPostWithOffset)
        baseController.post("/countCommentsByPost", false, ValidationMiddaleware.countCommentsByPost, this.countCommentsByPost)
    }

    private static newComment(req, res) {
        let comment = Comment.parse(req.body);
        comment.who = req.user.username;
        CommentRepo.newComment(comment, (err) => {
            if (err) return res.status(500).send({ err: err })
            res.status(200).send()
        })
    }

    private static deleteComment(req, res) {
        CommentRepo.getOwnerByCommentId(req.body.commentId, (err, ownerId) => {
            if (err) return res.status(500).send({ err: err })

            if (req.user.username === ownerId) {
                //user owned the comment
                CommentRepo.deleteComment(req.body.commentId, (err) => {
                    if (err) return res.status(500).send({ err: err })
                    return res.status(200).send()
                })
            } else {
                //user not owned the comment
                return res.status(403).send({ err: "comment is not yours ;(" })
            }
        })
    }

    private static getCommentsByPostWithOffset(req, res) {
        req.body.offset = parseInt(req.body.offset) * Config.limits.getCommentsByPostWithOffset;//oldest first
        CommentRepo.getCommentsByPostWithOffset(req.body.postId, req.body.offset, (err, comments: Comment[]) => {
            if (err) return res.status(500).send({ err: err })
            return res.status(200).send(comments)
        })
    }

    private static countCommentsByPost(req, res) {
        CommentRepo.countCommentsByPost(req.body.postId, (err, comments: number) => {
            if (err) return res.status(500).send({ err: err })
            return res.status(200).send(comments)
        })
    }
}