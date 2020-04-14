import jwt from "jsonwebtoken"


export default class JWT{

    private static get jwtKey() { return "masalan_alaki_;)" }

    private static get gcLoopTime() { return 1000 * 60 * 60 } // 1 hour
    private static get expireTime(){ return "1d" } // 1 day

    private static blackListTokens = []; //{exp number ,token string }

    public static gcLoop() {

        setInterval(() => {
            for (let i of JWT.blackListTokens) {
                if (i.exp < new Date().getTime()) {
                    JWT.blackListTokens.splice(JWT.blackListTokens.indexOf(i), 1);
                }
            }
        },JWT.gcLoopTime)
    }

    private static isInBlackList(token: string) : boolean {
        
        for (let i of JWT.blackListTokens) {
            if (i.token === token) return true;
        }
        return false;
    }
    
    public static middleware(req, res, next) {
        //get the token from the header if present
        const token = req.headers["x-auth-token"] || req.headers["x-access-token"];
        //if no token found, return response (without going to the next middelware)
        if (!token) return res.status(401).send("Access denied. No token provided.\n provide it in header as 'x-auth-token'");

        try {
            //if can verify the token, set req.user and pass to next middleware
            const decoded = jwt.verify(token, JWT.jwtKey);

            if (JWT.isInBlackList(token)) {
                return res.status(400).send("you loged out");
            }
            req.user = decoded;
            next();
        } catch (ex) {
            //if invalid token
            res.status(400).send(ex.message);
        }
    }

    public static logout(token: string) {
        const decoded = jwt.verify(token, JWT.jwtKey) as any;
        JWT.blackListTokens.push(
            {
                exp: decoded.exp,
                token: token
            }
        )
    }

    public static generateToken(userUsername: string): string {
       
        const token = jwt.sign({ username: userUsername }, JWT.jwtKey, { expiresIn: JWT.expireTime });
        return token;
    }
}