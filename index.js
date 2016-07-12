const http = require('http'),
    express = require('express');
var app = express();
const server = http.createServer(app);
var io = require('socket.io')(server);
global.streams = {};

app.set('view engine', 'pug');
app.get('/', (req, res, next) => {
    //console.log(req.headers);
    res.render('index', {streams});
})
app.use('/stream', require('./routes/stream'))

const net = require('net'),
    fs = require('fs');
net.createServer(conn => {

    conn.once('data', data => {
        var initialData = data.toString('utf8');

        var headersArray = initialData.split('\n');
        var first = headersArray.shift().split(' ');

        const method = first[0];

        if (method == 'SOURCE') {
            let route = first[1].substring(1);


            if (route in streams) {
              //TODO close
              return;
            }



            var config = {};

            headersArray.forEach(part => {
              var parts = part.trim().split(':');
              if (parts.length >= 2)
                config[parts.shift()] = parts.join(':').trim()
            })

            console.log(config);

            var file = fs.createWriteStream(`./files/${route}.mp3`);
            streams[route] = {
                stream: conn
            };
            conn.pipe(file);
            conn.write(`HTTP/1.0 200 OK\r\n`);
            io.emit('source', Object.keys(streams));
            conn.once('close', () => {
                delete streams[route];
                io.emit('source', Object.keys(streams));
            })

            conn.on('error', () => {
                console.log('error');
            })
        } else { // Send to express
            server.emit('connection', conn);
            conn.emit('data', data)
        }
    })
}).listen(3000);
