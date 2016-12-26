const express = require('express'),
    fs = require('fs');
var router = module.exports = express.Router();
var streams = require('../core/streams');

router.get('/:channel', (req, res, next) => {



    let channel = req.params.channel;
    if (!streams.exists(channel))
        return next();



    res.set('Content-Type', 'audio/mpeg');
    res.set('Content-Transfer-Encoding', 'binary');
    res.set('Transfer-Encoding', 'chunked');
    res.set("icy-br", 128)
    streams.get(channel).pipe(res, {end: true});
    // console.log(`\tuser connnected`, req.headers);

}, (req, res) => {

    res.send('not found')
})
