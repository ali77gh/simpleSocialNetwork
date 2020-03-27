var fs = require('fs');

export default class LoggerMiddleware {

    static counter = 0;

    static init(app) {

        app.use((req, res, next) => {

            LoggerMiddleware.counter++

            
            let body = JSON.parse(JSON.stringify(req.body));
            body.password = "we should not log passwords :)"
            var logText: String = `newReq on ${req.path}: 
                \t header:${JSON.stringify(req.headers)} 
                \t body:${JSON.stringify(body)} 
                \t at:${new Date()} 
                \t counter:${LoggerMiddleware.counter} \n`;

            //console.log(logText);
            fs.appendFile('logs.txt', logText, function (err) {
                if (err) throw err;
                //console.log(logText);
            });
            next()
        })

    }
}