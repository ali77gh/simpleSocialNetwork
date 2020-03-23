var fs = require("fs");


export default class LoggerControllers {

    static prePath = "/logs"

    static logFileName = "logs.txt"

    static init(app) {

        app.get(this.prePath + '/getAll', (req, res) => {
            
            var readStream = fs.createReadStream(this.logFileName);
            readStream.pipe(res);
        });

        app.get(this.prePath + '/clear', (req, res) => {

            fs.unlinkSync(this.logFileName)
            res.send('logs cleared')
        });

    }

}