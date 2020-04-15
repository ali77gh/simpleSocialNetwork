import BaseController from "./BaseController";
import ValidationMiddaleware from "./../middleware/validation/HashtagValidationMiddleware"

export default class HashtagController {

    public static init(app) {

        let baseController = new BaseController(app, "/hashtag")


        // hashtag CRUD
        baseController.post("/addHashtags", false, ValidationMiddaleware., this.addHashtags)
        baseController.post("/deleteHashtags", false, ValidationMiddaleware., this.deleteHashtags)
        baseController.post("/getPostHashtags", false, ValidationMiddaleware., this.getPostHashtags)
        baseController.post("/getHashtagPostsWithOffset", false, ValidationMiddaleware., this.getHashtagPostsWithOffset)
        baseController.post("/countHashtagPosts", false, ValidationMiddaleware., this.countHashtagPosts)
    }

    private static addHashtags(req, res) {
        
    }
    private static deleteHashtags(req, res) {

    }
    private static getPostHashtags(req, res) {

    }
    private static getHashtagPostsWithOffset(req, res) {

    }
    private static countHashtagPosts(req, res) {

    }
}