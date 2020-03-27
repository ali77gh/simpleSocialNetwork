
import auth from "./../middleware/AuthMiddleware";

export default class BaseController{

    private static _app;
    private static _prepath: string;
    

    static init(app,prepath) {
        this._app = app;
        this._prepath = prepath
    }

    protected static post(path: string, needAuth: boolean, validationMiddleware: (req, res, next) => void, cb: (req, res) => void) {
        path = this._prepath + path
        if (needAuth)
            this._app.post(path, validationMiddleware, auth, cb);
        else
            this._app.post(path, validationMiddleware, cb);
    }
}