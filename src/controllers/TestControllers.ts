
export default class Test{

    static i = 0;

    static init(app) {
        
        app.get('/test', (req, res) => {
            this.i++
            res.send('it works!!! '+ this.i)
        });
    
    }

}