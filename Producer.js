'use strict';

var net = require('net');

function Producer(options) {

    // server will be defined by the time this callback is executed
    function Listener() {
        console.log('Server listening on port', server.address().port);
    }

    // try base port of 3000, and increment by 1 later if busy
    var port        = +options.port || 3000;
    var txLogStream = options.txLogger.logStream;
    var rxLogStream = options.rxLogger.logStream;

    var server    = net.createServer(function (socket) {

        // dummy error handler to prevent unhandled exceptions
        socket

            .on('error', function() {
                console.error('socket error!');
            });

        socket

            .on('close', function() {

                console.log('Disconnected from client');
                options.source.unpipe(txLogStream)

            });

        options

            .source

            .pipe(txLogStream)

            .pipe(socket);

        // log client responses to file - we could also have used Winston's multi-transport
        // feature rather than piping back to stdout.  But, that was already available.
        socket

            .pipe(rxLogStream)

            .pipe(process.stdout);

        // not logging these messages in logger to avoid pulluting those files, makes it easier
        // to compare Producer/Consumer data
        console.log('New connection from client at', socket.remoteAddress);
    });

    // port busy, try next port index
    server
        .on('error', function (err) {

            if (err.code === 'EADDRINUSE') {

                console.log('Port', port, 'in use, trying', port+1);

                server
                    .removeListener('listening', Listener);

                port += 1;

                server
                    .listen(port, Listener);

            }

    });

    server

        .listen(port, Listener);

    return server;
}

module.exports = Producer;
