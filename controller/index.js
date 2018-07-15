var gMock = require('./lib/gmock');
gMock.execute('./controller/router.json');
module.exports = gMock.Router;