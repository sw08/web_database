const sql = require('sqlite3').verbose();

class DB {
    constructor() {
        this.tracks = undefined;
        this.acDB = undefined;
    }
    open(file) {
        this[file] = new sql.Database(`db/${file}.db`);
    }
    init(file, table, columns) {
        this[file].run(`CREATE TABLE IF NOT EXISTS ${table} (${columns});`)
    }
    track(tracks) {
        this.tracks = tracks;
    }
    get(file, table, conditions) {
        this[file].get(`SELECT * FROM ${table} WHERE ${Object.keys(conditions).join('=? AND ')}=?`, Object.values(conditions), (err, row) => {
            this.row = row;
        });
        return this.row;
    }
    getAll(file, table, conditions) {
        this[file].all(`SELECT * FROM ${table} WHERE ${Object.keys(conditions).join('=? AND ')}=?`, Object.values(conditions), (err, row) => {
            this.row = row;
        });
        return this.row;
    }
    insert(file, table, values) {
        this[file].run(`INSERT INTO ${table}(${Object.keys(values).join(', ')}) VALUES(${"?, ".repeat(Object.keys(values).length).slice(0, -2)})`, Object.values(values));
    }
    update(file, table, conditions, values) {
        this[file].run(`UPDATE ${table} SET ${Object.keys(values).join('=? AND ')}=? WHERE ${Object.keys(conditions).join('=? AND ')}=?`, Object.values(values).concat(Object.values(conditions)))
    }
    delete(file, table, conditions) {
        this[file].run(`DELETE FROM ${table} WHERE ${Object.keys(conditions).join('=? AND ')}=?`, Object.values(conditions));
    }
}

module.exports = {
    DB: DB,
    msToTime: function(time) {
        const ms = time % 1000;
        time -= ms
        time /= 1000;
        const s = time % 60;
        time -= s;
        time /= 60;
        return `${time}:${s}.${this.addZero(ms, 3)}`;
    },
    addZero: function (number, count) {
        number = String(number);
        return '0'.repeat(number.length - count) + number;
    }
};