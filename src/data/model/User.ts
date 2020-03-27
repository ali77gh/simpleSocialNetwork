import bcrypt from "bcrypt"

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

}