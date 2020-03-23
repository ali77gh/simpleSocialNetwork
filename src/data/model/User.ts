import Joi from "joi";
import bcrypt from "bcrypt"

export default class User {

    email: string;
    username: string;
    password: string;
    private _hashpass: string;

    get hashpass(): string{
        if (!this._hashpass)
            this._hashpass = bcrypt.hashSync(this.password, 10);
        return this._hashpass
    }
    set hashpass(hashpass:string) {
        this._hashpass = hashpass;
    }

    fullName: string;
    bio: string;


    static validate(Userobj): string | undefined {
        const schema = {
            email: Joi.string().min(5).max(255).required().email(),
            username: Joi.string().min(5).max(255).required().regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
            password: Joi.string().min(8).max(255).required(),
            fullName: Joi.string().min(3).max(255).required(),
            bio: Joi.string().min(3).max(500).required()
        };

        const { error } = Joi.validate(Userobj, schema);
        if (error)
            return error.details[0].message;
        else
            return undefined;
    }

}