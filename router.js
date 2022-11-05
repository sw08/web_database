const fs = require('fs');
const tool = require('./tool.js');
const setting = require('./setting.js');
const db = new tool.DB();

db.init('acServer', 'acLaptime');

module.exports = [
    {
        route: '/tracks',
        router: (req, res) => {
            db.track(req.body);
        },
        type: 'POST'
    },
    {
        route: '/getLaptime/:guid',
        router: (req, res) => {
            const result = db.get('acServer', 'acLaptime', {guid: req.params.guid});
            console.log(result, typeof result);
            return result;
        }
    }
]