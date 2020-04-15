import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/LikeValidationMiddleware"

export default class LikeController {

    public static init(app) {

        let baseController = new BaseController(app, "/like");

        // like CRUD
        baseController.post("/newLike", false, ValidationMiddaleware., this.newLike)
        baseController.post("/deleteLike", false, ValidationMiddaleware., this.deleteLike)
        baseController.post("/getLikesByPostOffset", false, ValidationMiddaleware., this.getLikesByPostOffset)
        baseController.post("/countLikesByPost", false, ValidationMiddaleware., this.countLikesByPost)
    }

    private static newLike(req, res) {
        
    }

    private static deleteLike(req, res) {

    }

    private static getLikesByPostOffset(req, res) {

    }

    private static countLikesByPost(req, res) {

    }
}