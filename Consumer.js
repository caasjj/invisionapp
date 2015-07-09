/**
 *
 * @type {exports|module.exports}
 */

'use strict';

var net = require('net');
var merge = require('merge-stream');
var _ = require('lodash');
var through2 = require('through2');
var Logger = require('./Logger');

function runOperation(op) {

    var operation;

    // try adding
    operation = op.split('+');
    if (operation.length > 1) {
        return op + '=' + (+operation[0] + +operation[1]) + '\n';
    }
    // try subtracting
    operation = op.split('-');
    if (operation.length > 1) {
        return op + '=' + (operation[0] - operation[1]) + '\n';
    }

    // try multiplying
    operation = op.split('*');
    if (operation.length > 1) {
        return op + '=' + (operation[0] * operation[1]) + '\n';
    }

    // try dividing
    operation = op.split('/');
    if (operation.length > 1) {
        return op + '=' + (operation[0] / operation[1]) + '\n';
    }

    console.error('Invalid operation encountered!!');

}

function processBuffer(buffer) {

    var self = this;

    var b = buffer.toString().replace(/\n/g, '');

    // any characters after the final '=' need to be processed on
    // next cycle so let's return them in a buffer
    var lastEqIndex = b.lastIndexOf('=')+1;
    var savedBuffer = new Buffer( b.slice[lastEqIndex] || 0);

    // now process all complete operations of the form 'nnnnXmmmm='
    var ops = b.slice(0,lastEqIndex).split('=');

    _.each(ops, function(op) {
        var result;
        if (op.length) {
           result = runOperation(op);
           if (result) {
               self.push(result);
           }
        }
    });

    return savedBuffer;
}


function Consumer(options) {

    var self = this;

    self.previousBuffer = [];
    self.txLogger = [];
    self.rxLogger = [];

    self.connections = _.map(options.producers, function (producer) {

        var connection = net.createConnection({
            port: producer.port,
            host: producer.address
        });

        return connection;
    });

    _.each(self.connections, function(connection, connectionIndex){

        var txLogger = new Logger({

            filename: options.logFilenameBase + 'TxLog_' + connectionIndex + '.log'

        });

        var rxLogger =  new Logger({

            filename: options.logFilenameBase + 'RxLog_' + connectionIndex + '.log'

        });

        connection

            .on('connect', function () {

                console.log('Connection index', connectionIndex, 'connected to server:', arguments);

            }
        );


        self.previousBuffer[connectionIndex] = new Buffer(0);


        connection

            .pipe( rxLogger.logStream )

            .pipe(through2(function (chunk, enc, callback) {

                var localBuffer = Buffer.concat([self.previousBuffer[connectionIndex], chunk]);
                self.previousBuffer[connectionIndex] = processBuffer.call(this, localBuffer);
                callback();

            }))

            .pipe( txLogger.logStream )

            .pipe(connection);

    });

}

Consumer.prototype.end = function () {

    // close all connections to Producers
    _.each(this.connections, function(connection) {
        connection.end();
    });

    console.log('Done.');
};

module.exports = Consumer;