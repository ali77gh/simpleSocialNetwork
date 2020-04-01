

import Joi from "joi";

export default class BaseValidationMiddaleware{


    protected static handleError(req, res, next, bodySchema, headerSchema, paramSchema) {

        if (bodySchema) {
            const { error } = Joi.validate(req.body, bodySchema);
            if (error)
                return res.status(400).send(
                    { err: `${error} in body (json form)` }
                );
        }

        if (headerSchema) {
            const { error } = Joi.validate(req.header, headerSchema);
            if (error)
                return res.status(400).send(
                    { err: `${error} in header` }
                );
        }

        if (paramSchema) {
            const { error } = Joi.validate(req.params, paramSchema);
            if (error)
                return res.status(400).send(
                    { err: `${error} in params` }
                );
        }

        next();
    }
}