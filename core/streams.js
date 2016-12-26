
class Streams {
    constructor() {
        this.streams = {};
    }

    add(path, stream) {
        this.streams[path] = stream;
    }

    remove(path) {
        // this.streams[path].on('end', () => {
        //     console.log('done');
        // }).end()
        delete this.streams[path];
    }

    exists(path) {
        return this.streams.hasOwnProperty(path)
    }

    get(path) {
        return this.streams[path]
    }

    status() {
        Object.keys(this.streams).forEach(alias => {
            console.log('alias', alias, this.streams[alias]._readableState.pipesCount);
        });
    }
}



var ok = module.exports = new Streams();

// setInterval(function () {
//     ok.status();
// }, 1000);
