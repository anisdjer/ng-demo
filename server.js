var 
        express = require('express')
    ,   app = express()
    ,   bodyParser = require('body-parser')
    ,   WebSocketServer = require('websocket').server; 
 
;

var 
        users = [ /* Registred users */
            {
                id    : 1,
                email : "admin1@tritux.com",
                password : "admin1",
                username : "Admin1",
                roles : [
                    "admin", "user", "anonymous"
                ]
            },
            {
                id    : 2,
                email : "user1@tritux.com",
                password : "user1",
                username : "User1",
                roles : [
                    "user", "anonymous"
                ]
            }
        ] 
;

var sockets = [];


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/app/public'));


var server = app.listen(8800);

app.post('/api/auth', function(req, res) {
    var _authenticated = false, _user = null;
    
    
    /* Query database for credentials */
    users.forEach(function(user) {
       if(req.body.username === user.email && req.body.password === user.password) {
            
            console.log("User found");
            _user = user;
            _authenticated = true;
           return;
       } 
    }); 
    if(_authenticated) {
        res.json({
                result : 1, 
                user : _user
        }).status(200);
    } else {
        console.log("User not found");
        res.json({
            result : 0  
        });
    }
   
    
});

/* POST REST API */
 var posts = [ ];

app.get('/api/posts', function(req, res) {
    res.json(posts).status(200);
    res.end();
}); 
app.post('/api/posts', function(req, res) {
//    posts.push(req.body);
    res.end();
}); 


app.get('*', function(req, res) {
    res.end('Not Found 404');
});

  
// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    console.log("Websocket connection");
    
    
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
            console.log("Websocket message");
            console.log(message);
            
            var data = JSON.parse(message.utf8Data);
            if(data.type === 1) { 
                sockets.push(connection);
            }
            if(data.type === 2) {
                data.post.id = posts.length + 1;
                posts.push(data.post);
                for(var i =0, l = sockets.length; i<l; i+=1){
              
                    sockets[i].send(message.utf8Data);
                    
                } 
                console.log(sockets.length);
            }
        }
    });

    connection.on('close', function(connection) {
        // close user connection
//        sockets.splice(sockets.indexOf(connection), 1);
            console.log("Websocket close");
    });
});

