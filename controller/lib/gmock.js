var fs = require('fs');
var express = require('express');
var Router = express.Router();

var gmock = {};

gmock.readFile = path => {
    
}

gmock.execute = path => {
    var file = JSON.parse(fs.readFileSync(path, 'utf8'));
    file.routes.forEach(item => {
        if (item.type === 'get') {
            Router.get(item.url, (req, res) => {
                res.send(item.url + ' ok');
            });
        }
    });
}

gmock.Router = Router;
module.exports = gmock;