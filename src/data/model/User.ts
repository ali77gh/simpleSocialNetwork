import bcrypt from "bcrypt"
import Joi from "joi"

export default class User {

    email: string;
    username: string;
    password: string;
    private _hashpass: string;

    get hashpass(): string {
        if (!this._hashpass)
            this._hashpass = bcrypt.hashSync(this.password, 10);
        return this._hashpass
    }
    set hashpass(hashpass: string) {
        this._hashpass = hashpass;
    }

    fullName: string;
    bio: string;

    private constructor(email: string, username: string, password: string, fullName: string, bio: string) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.bio = bio;
    }

    public static parse(userObj: any): User {

        return  new User(
            userObj.email,
            userObj.username,
            userObj.password,
            userObj.fullName,
            userObj.bio
        );
    } 

    private static _joi = {
        email: Joi.string().min(5).max(255).required().email(),
        username: Joi.string().min(5).max(255).required().regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
        password: Joi.string().min(8).max(255).required(),
        fullName: Joi.string().min(3).max(255).required(),
        bio: Joi.string().min(3).max(500).required()
    }

    public static get joi() {
        return this._joi;
    }

}