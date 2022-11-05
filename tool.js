const sql = require('sqlite3').verbose();

class DB {
    constructor() {
        this.initialized = false;
        this.tracks = undefined;
        this.acDB = undefined;
    }
    init(file, table) {
        this[file] = new sql.Database(`db/${file}.db`);
        this[file].run(`CREATE TABLE IF NOT EXISTS ${table} (guid INTEGER PRIMARY KEY, track TEXT, car_model TEXT, laptime INTEGER);`)
        this.initialized = true;
    }
    track(tracks) {
        this.tracks = tracks;
    }
    get(file, table, conditions) {
        var a = undefined;
        var b = a;
        this[file].get(`SELECT * FROM ${table} WHERE ${conditions.keys().join('=? AND ')}`, conditions.values(), function (err, row) {
            b = row;
        });
        return a;
    }
}

module.exports = {
    DB: DB
};