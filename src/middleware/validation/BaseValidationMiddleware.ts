

import Joi from "joi";

export default class BaseValidationMiddaleware {

    protected static generateMiddleware(schema) {
        return (req, res, next) => {
            if (schema.body) {
                const { error } = Joi.validate(req.body, schema.body);
                if (error)
                    return res.status(400).send(
                        { err: `${error} in body (json form)` }
                    );
            }

            if (schema.header) {
                const { error } = Joi.validate(req.header, schema.header);
                if (error)
                    return res.status(400).send(
                        { err: `${error} in header` }
                    );
            }

            if (schema.param) {
                const { error } = Joi.validate(req.params, schema.param);
                if (error)
                    return res.status(400).send(
                        { err: `${error} in params` }
                    );
            }

            next();
        }
    }

    public static get noValidation() {
        return this.generateMiddleware(
            {
                //empty
            }
        )
    }

    public static globalJois = {
        offset: Joi.number().integer().min(1).required(),
    }
}