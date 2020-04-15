import BaseController from "./BaseController";
import ValidationMiddaleware from "./../middleware/validation/HashtagValidationMiddleware"

export default class HashtagController {

    public static init(app) {

        let baseController = new BaseController(app, "/hashtag")


        // hashtag CRUD
        baseController.post("/addHashtags", true, ValidationMiddaleware.addHashtags, this.addHashtags)
        baseController.post("/deleteHashtags", true, ValidationMiddaleware.deleteHashtags, this.deleteHashtags)
        baseController.post("/getPostHashtags", false, ValidationMiddaleware.getPostHashtags, this.getPostHashtags)
        baseController.post("/getHashtagPostsWithOffset", false, ValidationMiddaleware.getHashtagPostsWithOffset, this.getHashtagPostsWithOffset)
        baseController.post("/countHashtagPosts", false, ValidationMiddaleware.countHashtagPosts, this.countHashtagPosts)
        baseController.post("/searchHashtagByName", false, ValidationMiddaleware.searchHashtagByName, this.countHashtagPosts)
    }

    private static addHashtags(req, res) {
        //TODO check if user is owner
    }
    private static deleteHashtags(req, res) {
        //TODO check if user is owner
    }
    private static getPostHashtags(req, res) {

    }
    private static getHashtagPostsWithOffset(req, res) {

    }
    private static countHashtagPosts(req, res) {

    }
}