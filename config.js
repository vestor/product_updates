var config = {};

config.server = {}
config.mongodb = {};

config.mongodb.hostname = process.env.MONGO_HOST || '127.0.0.1';
config.mongodb.port = process.env.MONGO_PORT || '27017';
config.mongodb.dbname = process.env.MONGO_DB_NAME || 'usage';
config.mongodb.connection = config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.dbname;

config.server.hostname = 'localhost';
config.server.port = '8100';
config.server.connection = config.server.hostname + ':' + config.server.port;

module.exports = config;
