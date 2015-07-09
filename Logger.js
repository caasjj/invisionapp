/**
 * Created by developer on 7/8/15.
 */

'use strict';

var Winston  = require('winston');
var through2 = require('through2');

function Logger(destination) {
    // log to file for now
    var self = this;

    if (destination.filename && typeof(destination.filename==='string')) {
        self.logger = new Winston.Logger({
            transports: [new Winston.transports.File({ filename: destination.filename })],
            exceptionHandlers: [ new Winston.transports.File( {filename: destination.filename + '_exceptions'})]
        })
    }

    this.logStream = through2( function(chunk, enc ,callback) {
        var logData = chunk.toString();
        if (self.logger) {
            self.logger.log('info', logData);
        }
        this.push(chunk);
        callback();
    })
}


module.exports = Logger;