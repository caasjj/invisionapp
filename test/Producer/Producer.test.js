"use strict";
var expect      = require('chai').expect;
var _           = require('lodash');
var net         = require('net');
var should      = require('should');
var OpGenerator = require('../../OpGenerator');
var Producer    = require('../../Producer');
var Logger      = require('../../Logger');

describe('Producer', function ProducerTest() {

    var producer;
    var port = 3000;
    var throughput = 1;

    before(function beforeProducerTests(done){

        producer = Producer({
            source: new OpGenerator({
                throughput: throughput
            }),
            port: port,
            txLogger: new Logger({ filename: './logs/ServerTxLog.log'}),
            rxLogger: new Logger({ filename: './logs/ServerRxLog.log'})
        });

        done();
    });


    describe('Test Consumer Connections', function ConsumerConnections(){
        it('should connect to a consumer', function it(done) {

            (function() {
                net.createConnection({
                    port: port,
                    host: 'localhost'
                })
            }).should.not.throw();

            done();
        });
    });

});