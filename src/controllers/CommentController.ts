import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/CommentValidationMiddleware"

export default class CommentController {

    public static init(app) {

        let baseController = new BaseController(app, "/comment")

        // comment CRUD
        baseController.post("/newComment", false, ValidationMiddaleware., this.newComment)
        baseController.post("/deleteComment", false, ValidationMiddaleware., this.deleteComment)
        baseController.post("/getCommentsByPostWithOffset", false, ValidationMiddaleware., this.getCommentsByPostWithOffset)
        baseController.post("/countCommentsByPost", false, ValidationMiddaleware., this.countCommentsByPost)
    }

    private static newComment(req, res) {
        
    }

    private static deleteComment(req, res) {

    }

    private static getCommentsByPostWithOffset(req, res) {

    }

    private static countCommentsByPost(req, res) {

    }
}