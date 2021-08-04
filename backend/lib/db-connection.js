const AWS = require("aws-sdk");
const conn = require('../config/conn.json')
AWS.config.update(conn);

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;
