import BaseController from "./BaseController"
import ValidationMiddaleware from "./../middleware/validation/PostValidationMiddleware"

export default class PostController{

    public static init(app) {

        let baseController = new BaseController(app, "/post")

        // // post CRUD
        // baseController.post("/newPost", true, ValidationMiddaleware., this.)
        // baseController.post("/editTitle", true, ValidationMiddaleware., this.)
        // baseController.post("/editContent", true, ValidationMiddaleware., this.)
        // baseController.post("/getpost/:postId", false, ValidationMiddaleware., this.)
        // baseController.post("/deletePost", true, ValidationMiddaleware., this.)
        // baseController.post("/getSomeOnesPosts", false, ValidationMiddaleware., this.)
        // baseController.post("/getMyWallWithOffset", true, ValidationMiddaleware., this.)
        // baseController.post("/searchByPostTitle", false, ValidationMiddaleware., this.)

        // // comment CRUD
        // baseController.post("/newComment", false, ValidationMiddaleware., this.)
        // baseController.post("/deleteComment", false, ValidationMiddaleware., this.)
        // baseController.post("/getCommentsByPost", false, ValidationMiddaleware., this.)

        // // hashtag CRUD
        // baseController.post("/addHashtag", false, ValidationMiddaleware., this.)
        // baseController.post("/deleteHashtag", false, ValidationMiddaleware., this.)
        // baseController.post("/getPostHashtags", false, ValidationMiddaleware., this.)
        // baseController.post("/getHashtagPostsWithOffset", false, ValidationMiddaleware., this.)
        
        // // like CRUD
        // baseController.post("/newLike", false, ValidationMiddaleware., this.)
        // baseController.post("/deleteLike", false, ValidationMiddaleware., this.)
        // baseController.post("/getLikesByPost", false, ValidationMiddaleware., this.)
    }


    private static newPost(req, res) {
        
    }
}