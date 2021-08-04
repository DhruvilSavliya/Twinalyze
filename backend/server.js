const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/');
const response = require('./middlewares/response');
const PORT = process.env.PORT || 5000;

const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization")
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Content-Type", "application/json");

    next();
})
app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json(), response);
app.use('/api/',routes);

app.listen(PORT, () => console.log(`Port listening at: ${PORT}`));
process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.info('Server Restarting...');
});