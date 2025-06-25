/*
run `node .\mock-server\server.js` to start mock server
*/

const express = require('express');
const logger = require('morgan');
const http = require('http');
const cors = require('cors');
const oidc = require('./oidc.js');
const port = 4201;

// configure server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cors());
oidc('http://localhost:' + port, app);

// run server
http.createServer(app).listen(port);
