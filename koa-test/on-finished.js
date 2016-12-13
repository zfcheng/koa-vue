var onFinished = require('on-finished');

var http = require('http');

http.createServer(function(req, res){

    onFinished(res, function (err, res) {
        console.log('123123')
    })

    onFinished(req, function (err, req) {
        console.log('req')
    })

    res.writeHead(200, {'Content-type' : 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');

    

}).listen(5000);
console.log('listening 5000')