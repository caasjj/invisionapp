/**
 ** Module to generate a string stream of the form
 ** 'op1+|-|*|/op2=\n'.  op1 and op2 are random integers
 ** from 0 to options.maxVal (default: 2^16).
 ** Data is always available instantly from this stream.
 **/
"use strict";
var Reader = require('stream').Readable;
var Util = require('util');
var _ = require('lodash')

function OpGenerator(options) {

    Reader.call(this, {
        'encoding': 'utf-8'
    });

    // typeof(null) is 'object', so need to check!
    if (!options || typeof(options) !== 'object') {
        options = {};
    }

    this.ops        = options.ops || ['+', '-', '*', '/'];
    this.maxVal     = options.maxVal || Math.pow(2, 16);
    this.throughput = options.throughput;

    this.on('error', function(err) {
        console.log('OpGen error', err);
    })

}

Util.inherits(OpGenerator, Reader);

OpGenerator.prototype._read = function () {
    var op = new Buffer(
        _getOperand(this.maxVal) +
        _getOperator(this.ops) +
        _getOperand(this.maxVal) +
        '=' +
        '\n',

        'utf-8'
    );

    if (!this.throughput) {
        this.push(op);
    } else {
        // using .bind(this) here instead of 'var self=this', just to show
        // another option - I prefer use 'self'
        setTimeout(function () {
            this.push(op);
        }.bind(this), Math.floor(Math.random() * 2 / this.throughput * 1000));
    }
};

function _getOperand(maxVal) {
    return Math.floor(Math.random() * maxVal);
}

function _getOperator(ops) {
    return ops[Math.floor(Math.random() * ops.length)]
}
module.exports = OpGenerator;