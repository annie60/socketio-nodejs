const bodyParser    = require('body-parser');
const dotenv        = require('dotenv');
const express       = require('express');
const fs            = require('fs')

/**********************************************************
 *                                                        *
 *            APP ENVIROMENT VARIABLES LOADER             *
 *                                                        *
 **********************************************************/
const environment   = process.env.NODE_ENV || 'dev';
dotenv.load({path: `.env.${environment}`});

/**********************************************************
 *                                                        *
 *                 EXPRESS CONFIGURATION                  *
 *                                                        *
 **********************************************************/
const PORT              = process.env.PORT || 3000;
const app               = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('./config/allowCors'));

function index(req, res) {
    fs.readFile(__dirname + '/index.html', function(err, data){
    res.writeHead(200);
        res.end(data);
    });
}



/**
 * SOCKET IO CONFIG
*/
const server            = require(process.env.PROTOCOL).Server(app);
const io                = require('socket.io')(server);

/**
 * ROUTES
*/
app.post('/api/kafka/send', (req,res,next)=>{
    console.log(req.body);
    const request =JSON.stringify(req.body);
    const msg = JSON.parse(request);

    io.sockets.emit('send_task', msg.content);
    res.send({});
});
app.post('/api/kafka/new', (req,res,next)=>{
    console.log(req.body);
    const request =JSON.stringify(req.body);
    const msg = JSON.parse(request);

    io.sockets.emit('send_new', msg.content);
    res.send({});
});
app.get('/', index);


server.listen(PORT, () => {
    console.log(`Backend is running on port: ${PORT}`);
});

module.exports = app;