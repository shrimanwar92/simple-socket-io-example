var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(httpServer).listen(8081);
function httpServer(request, response) {

    var path = url.parse(request.url).pathname;
    switch(path) {
    	case "/":
    		 response.writeHead(200, {'Content-Type': 'text/html'});
             response.write('hello world');
             response.end();
    	break;
    	case "/socket.html":
    		console.log(__dirname + path)
    		fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            }); 
    	break;
    	default:
    		response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
    	break;
    }
}

var listener = io.listen(server);
listener.sockets.on("connection", function(socket) {
	
	// send data to client
	setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);

    //recieve client data
  	socket.on('client_data', function(data){
    	socket.emit('reply_from_server', {'data': data.letter});
  	});
})
