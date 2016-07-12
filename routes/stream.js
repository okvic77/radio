const express = require('express'), fs = require('fs');
var router = module.exports = express.Router();

router.get('/:channel', (req, res, next) => {
    console.log(req.originalUrl, req.method, req.headers);
    next();
}, (req, res, next) => {
    let channel = req.params.channel;
    if (!(channel in streams))
        return next();
        res.set('Content-Type', 'audio/mpeg');
        res.set('Accept-Ranges', 'bytes');
    streams[channel].stream.pipe(res);
})
