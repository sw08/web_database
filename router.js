const fs = require('fs');
const tool = require('./tool.js');
const setting = require('./setting.js');
const { text } = require('body-parser');
const db = new tool.DB();

db.open('acServer');
db.init('acServer', 'personalbests', 'guid INTEGER, track TEXT, car_model TEXT, laptime INTEGER');
db.init('acServer', 'trackbests', 'guid INTEGER, track TEXT, car_model TEXT, laptime INTEGER');
db.init('acServer', 'usernames', 'guid INTEGER PRIMARY KEY, name TEXT')

module.exports = [
    {
        route: '/tracks',
        router: (req, res) => {
            db.track(req.body);
            res.sendStatus(200);
        },
        type: 'POST'
    },
    {
        route: '/get_trackbest/:track/:car',
        router: (req, res) => {
            const result = db.get('acServer', 'trackbests', {track: req.params.track, car_model: req.params.car});
            res.json(result == undefined ? {} : result);
        }
    },
    {
        route: '/get_personalbest/:track/:car/:guid',
        router: (req, res) => {
            const result = db.get('acServer', 'personalbests', {track: req.params.track, car_model: req.params.car, guid: Number(req.params.guid)});
            res.json(result == undefined ? {} : result);
        }
    },
    {
        route: '/get_rankings/:track/:car',
        router: (req, res) => {
            const result = db.getAll('acServer', 'personalbests', {track: req.params.track, car_model: req.params.car});
            res.json(result == undefined ? {} : result);
        }
    },
    {
        route: '/set_personalbest',
        router: (req, res) => {
            const data = req.body;
            if (db.get('acServer', 'personalbests', {guid: Number(data.user_guid), track: data.track, car_model: data.model}) === undefined) {
                db.insert('acServer', 'personalbests', {guid: Number(data.user_guid), track: data.track, car_model: data.model, laptime: data.laptime});
            } else {
                db.update('acServer', 'personalbests', {guid: Number(data.user_guid), track: data.track, car_model: data.model}, {laptime: data.laptime})
            }
            res.sendStatus(200);
        },
        type: 'POST'
    },
    {
        route: '/set_trackbest',
        router: (req, res) => {
            const data = req.body;
            if (db.get('acServer', 'trackbests', {track: data.track, car_model: data.model}) === undefined) {
                db.insert('acServer', 'trackbests', {track: data.track, car_model: data.model, guid: Number(data.user_guid), laptime: data.laptime});
            } else {
                db.update('acServer', 'trackbests', {track: data.track, car_model: data.model}, {laptime: data.laptime, guid: Number(data.user_guid)});
            }
            res.sendStatus(200);
        },
        type: 'POST'
    },
    {
        route: '/set_username',
        router: (req, res) => {
            const data = req.body;
            const username = db.get('acServer', 'usernames', {guid: Number(data.guid)});
            if (username === undefined) {
                db.insert('acServer', 'usernames', {guid: Number(data.guid), name: data.name});
            } else if (username !== data.name) {
                db.update('acServer', 'usernames', {guid: Number(data.guid)}, {name: data.name});
            }
            res.sendStatus(200);
        },
        type: 'POST'
    },
    {
        route: '/aroundme/:track/:car/:guid',
        router: (req, res) => {
            laptimes = db.getAll('acServer', 'personalbests', {track: req.params.track, guid: req.params.guid, car: req.params.car});
            laptimes.sort(a, b => a.laptime - b.laptime);
            const index = laptimes.find(x => x.guid === req.params.guid)
            var temp;
            if (2 <= index && index < laptimes.length - 3) {
                temp = laptimes.slice(index - 2, index + 3);
            } else if (index < 2) {
                temp = laptimes.length >= 5 ? laptimes.slice(0, 5) : laptimes
            } else if (index >= laptimes.length - 3) {
                temp = laptimes.length >= 5 ? laptimes.slice(-5) : laptimes
            }
            var zerocount = Math.round(Math.log10(index + 2))
            var result = '';
            var name;
            for (var i = -2; i <= 2; i++) {
                name = db.get('acServer', 'usernames', {guid: temp[i + 2].guid})
                result += `${addZero(index - 2, zerocount)}. ${temp[i + 2].laptime} // ${name.name}\n`;
            }
            res.send(result);
        }
    }
]