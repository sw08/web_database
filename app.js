const express = require('express');
const qs = require('qs');
const routers = require('./router.js');
const bodyParser = require('body-parser');
const setting = require('./setting.js');

const app = express();

app.set('port', process.env.PORT || 443);

app.set('query parser', (str) => {
    return qs.parse(str);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.return("Error");
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(req.headers)
    if (setting.authorization.user + '||' + setting.authorization.password != req.headers.authorization) {
        console.log(setting.authorization.user + '||' + setting.authorization.password);
        console.log(req.headers.authorization)
        res.sendStatus(403);
        return;
    }
    next();
});


const router = express.Router();
for (var i = 0; i < routers.length; i++) {
    if (routers[i].type === 'get' || routers[i].type == undefined){
        router.route(routers[i].route).get(routers[i].router);
    } else {
        router.route(routers[i].route).post(routers[i].router);
    }
}

app.use('/acServer/', router);

app.listen(app.get('port'), () => {
    console.log(`Port ${app.get('port')} opened`);
});