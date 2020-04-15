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

        return new User(
            userObj.email,
            userObj.username,
            userObj.password,
            userObj.fullName,
            userObj.bio
        );
    }

    public static joi = {
        email: Joi.string().min(5).max(60).required().email(),
        username: Joi.string().min(5).max(50).required().regex(/^[a-zA-Z0-9]+([_]?[a-zA-Z0-9])*$/),
        password: Joi.string().min(8).max(30).required(),
        fullName: Joi.string().min(3).max(50).required().regex(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
        bio: Joi.string().min(3).max(500).required()
    }

}