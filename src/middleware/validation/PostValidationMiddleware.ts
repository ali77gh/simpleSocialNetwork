
import BaseValidationMiddaleware from "./BaseValidationMiddleware"
import Post from "../../data/model/Post";
import User from "../../data/model/User";

export default class PostValidationMiddleware extends BaseValidationMiddaleware {


    //---------------Naming-----------------
    // _X_Y
    // X api path
    // Y == "B" => body validation schema
    // Y == "H" => header validation schema
    // Y == "P" => params validation schema


    private static _newPost_B = {
        title: Post.joi.title,
        content: Post.joi.content,
    };

    private static _editTitle_B = {
        id: Post.joi.id,
        newTitle: Post.joi.title,
    };

    private static _editContent_B = {
        id: Post.joi.id,
        newContent: Post.joi.content,
    };

    private static _getPost_P = {
        postId: Post.joi.id,
    };

    private static _deletePost_B = {
        postId: Post.joi.id,
    };

    private static _getSomeonesPosts_B = {
        postId: User.joi.username,
        offset: BaseValidationMiddaleware.globalJois.offset,
    };

    private static _countSomeonesPosts_B = {
        postId: User.joi.username,
    };

   
    static get newPost() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._newPost_B, null, null
            )
        }
    }

    static get editTitle() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._editTitle_B, null, null
            )
        }
    }

    static get editContent() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._editContent_B, null, null
            )
        }
    }

    static get getPost() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                null, null, this._getPost_P
            )
        }
    }

    static get deletePost() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._deletePost_B, null, null
            )
        }
    }

    static get getSomeonesPosts() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._getSomeonesPosts_B, null, null
            )
        }
    }

    static get countSomeonePosts() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                this._countSomeonesPosts_B, null, null
            )
        }
    }

    // TODO make others like this      (What the fuck i was thinking before??!)
    static get getMyWallWithOffset() {
        return (req, res, next) => {
            super.handleError(req, res, next,
                { offset: BaseValidationMiddaleware.globalJois.offset },// body
                null,//
                null
            )
        }
    }
    
}