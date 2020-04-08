
import JWT from "./../middleware/AuthMiddleware";

export default class BaseController {

    private  _app;
    private  _prepath: string;

    public constructor(app, prepath: string) {
        this._app = app;
        this._prepath = prepath
    }

    public post(path: string, needAuth: boolean, validationMiddleware: (req, res, next) => void, cb: (req, res) => void) {
        path = this._prepath + path
        if (needAuth)
            this._app.post(path, validationMiddleware, JWT.middleware, cb);
        else
            this._app.post(path, validationMiddleware, cb);
    }

    public get(path: string, needAuth: boolean, validationMiddleware: (req, res, next) => void, cb: (req, res) => void) {
        path = this._prepath + path
        if (needAuth)
            this._app.get(path, validationMiddleware, JWT.middleware, cb);
        else
            this._app.get(path, validationMiddleware, cb);
    }
}