const http = require('http'),
    express = require('express');
var app = express();
const server = http.createServer(app);
var io = require('socket.io')(server);
// global.streams = {};

var streams = require('./core/streams')

app.set('view engine', 'pug');



app.get('/', (req, res, next) => {
    //console.log(req.headers);
    res.render('index', {
        streams: {}
    });
})


app.use('/stream', require('./routes/stream'))

// var ffmpeg = require('fluent-ffmpeg');

const spawn = require('child_process').spawn;


const net = require('net'),
    fs = require('fs');
net.createServer(conn => {
    conn.once('data', data => {
        var initialData = data.toString('utf8');
        var [first, ...others] = initialData.split('\n');
        var [method, route] = first.split(' ');

        if (method == 'SOURCE') {
            var name = route.substring(1);
            var config = {};
            others.forEach(part => {
                var parts = part.trim().split(':');
                if (parts.length >= 2)
                    config[parts.shift()] = parts.join(':').trim()
            })

            console.log(name, config);
            conn.write(`HTTP/1.0 200 OK\r\n`);


            const outOptions = '-ar 44100 -ac 2 -ab 128k -f mp3';

            // var meta = ['-metadata', 'author="FFmpeg Bayou Jug Band"']
            // meta.push('-metadata', 'title="Decode my Heart (Lets Mux)"')

            const adv = []; // '-hide_banner'

            const ls = spawn('ffmpeg', ['-i', 'pipe:0', ...outOptions.split(' '), ...adv, `pipe:1`]);

            // ls.stdout.pipe(fs.createWriteStream(`files-${name}-${Date.now()}.mp3`))
            streams.add(name, ls.stdout)

            ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            ls.on('close', (code) => {
                streams.remove(name)
            });


            console.log('open');
            conn.once('close', () => {
                console.log('closed');
            })
            conn.on('error', () => {
                console.log('error');
            });

            conn.pipe(ls.stdin)

        } else { // Send to express
            server.emit('connection', conn);
            conn.emit('data', data)
        }
    })
}).listen(process.env.PORT || 3000);
