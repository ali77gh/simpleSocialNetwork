import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/CommentValidationMiddleware"

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
        
    }

    private static deleteComment(req, res) {
        //TODO check if comment owner is deleting
    }

    private static getCommentsByPostWithOffset(req, res) {
        //TODO watch offset
    }

    private static countCommentsByPost(req, res) {

    }
}