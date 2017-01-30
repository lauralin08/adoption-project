var path = require('path');
var express = require('express');

// Retrieve the port number from the environment variable, 
// or else use 3000 for local development.
var PORT = process.env.PORT || 3000;

var app = express();

// Generate a static path by adding the directory name with the public folder
var staticPath = path.join(__dirname, '/public');

// Load assets from the static path
app.use(express.static(staticPath));

// Start listening on the designated port
app.listen(PORT, function() {
  console.log('listening on port :', PORT);
});