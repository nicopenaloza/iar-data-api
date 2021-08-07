const mysql = require('mysql');

class db {
    constructor (host, user, password, db) {
        this.db = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: db_name,
        });
    }

    test () {
        return 'eeeeeeeeeeaaaaa';
    }


}

exports.db = db;