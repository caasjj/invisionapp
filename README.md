# NodeJS Producer/Consumer demo

## Introduction

This repository is a demonstration of Node's streaming mechanism to implement a Producer and Consumer with automatic flow control.  The producer can be set up to throttle to a desired rate from 1 message/second up to 100 messages/second.  The throttling can be completely disabled to let the Producer run at the maximum rate available from the host.

The Consumer reads messages from one or more Producers, runs calculations on the messages and responds to each Producer.  For convenience, a script allows the user to start multiple Producers simultaneously.

Each instance of a Producer logs its input and output to a file in the `/logs` directory.  The Producer log filenames are indexed by an index starting at 0 and incremented for each instance of the Producer.  Similarly, each Consumer also logs both directions of each of its connections to files in the '/logs' directory.  These files are indexed similary by an index corresponding to each connection.

The Producer sends messages of the form `xxxx[+|-|*|/]yyyy=`, where `xxxx` and `yyyy` are integers.  The Consumer responds with `xxxx[+|-|*|/]yyyy=rrrr`, where `rrrr` is the result of the calculations.  These will all appear in the appropriate logs.

### Installation

Clone the repo with: 

`git clone https://github.com/caasjj/invisionapp.git`

Install node dependencies:

`npm install`


### Running the Producer(s)

The command to start the Producer server is simply `Server`.  See `Server -h`.

With no arguments, it will start a Producer at port `3000` with a default throughput of `10` messages per second.

To change the port only, provide the `-p` flag:

`Server -p 3001`

Port numbers must be in the range [1024, 65535].

To change throughput:

`Server -t 20`

To start multiple Producers at default throughput of `10`, provide a list of ports:

`Server -p 3001,3002,3003`

To change the throughput of all Producers to `5` messages per second:

`Server -p 3001,3002,3003 -t 5`

To assign different throughput to each Producer:

`Server -p 3001,3002,3002 -t 1,5,10`

To disable throttling on a given producer all together, assign it a throughput of `0`:

`Server -p 3000,3001,3001 -t 0,10,10`

User `<CTRL-C>` to stop the Producer.

### Running the Consumer

A Consumer can consume all the data from more than one Producer, and return calculated results back to the Producer.

The command to start the Consumer is `Client`, which will simply Consume messages from a single Producer on `localhost` at port `3000`.  See `Client -h`.

The logic for command line parameters is similar to that used for `Server`.

To connect a Consumer to a Producer at a different port than the default `3000`:

`Client -p 3001`

To connect to multiple Producers:

`Client -p 3001,3002,3003`

And to connect to a different host than localhost, provide the IP address and port:

`Client -a 192.168.1.10 -p 3001,3002,3003`

To connect to multiple Producers on different hosts:

`Client -a hostIp1,hostIp2,hostIp3 -p hostPort1,hostPort2,hostPort3`

User `<CTRL-C>` to stop the Consumer.

### Logging

Both Producers and Consumers log both ends of their streams.  Logs are stored in the `/logs` directory under `Producer[Rx|Tx]Log_[n].log` and `Consumer[Rx|Tx]Log_[n].log`, where `n` is the index corresponding to the respective server or connection.

### Tests

Tests were started but did not get implemented due to time limit.  To run what is there, use `npm test` in the project root directory.








