import jwt from "jsonwebtoken"


export default class JWT{

    private static get jwtKey() { return "masalan_alaki_;)" }
    
    public static middleware(req, res, next) {
        //get the token from the header if present
        const token = req.headers["x-access-token"] || req.headers["x-auth-token"];
        //if no token found, return response (without going to the next middelware)
        if (!token) return res.status(401).send("Access denied. No token provided.\n provide it in header as 'x-auth-token'");

        console.log("sended token : " + token)
        try {
            //if can verify the token, set req.user and pass to next middleware
            const decoded = jwt.verify(token, JWT.jwtKey);
            req.user = decoded;
            next();
        } catch (ex) {
            console.log(ex)
            //if invalid token
            res.status(400).send("Invalid token.");
        }
    }

    public static generateToken(userUsername: string): string {
       
        const token = jwt.sign({ username: userUsername }, JWT.jwtKey);
        console.log("generated token : " + token)
        return token;
    }
}