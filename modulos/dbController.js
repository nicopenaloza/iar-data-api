const mysql = require('mysql');

class dbC {
    constructor () {
        this.db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'iar',
        });
    }

    guardarNuevaEntrada(arr) {
        arr.map(equipo => {
            console.log(equipo.data)
            this.db.query(
                "INSERT INTO logs (`id_pc`, `nombre`, `data`, `fecha`) VALUES (?, ?, ?, CURRENT_TIMESTAMP())",
                [equipo.id, equipo.nombre, JSON.stringify(equipo.data)],
                (err, res) => {if (err) throw err; console.log(equipo.nombre, 'Guardado en la db')}
            );
            
        });
    }

    traerLogs(ress) {
        this.db.query(
            "SELECT * FROM logs", 
            (err, res) => {
                if (err) throw err;

                let result = [];

                res.map(r => {
                    result.push({
                        id: r.id,
                        id_pc: r.id_pc,
                        nombre: r.nombre,
                        data: JSON.parse(r.data),
                        fecha: r.fecha
                    })
                })

                ress.json(result);
            }
        )
    }

    traerLogsDeUnEquipo(equipo, ress) {
        this.db.query(
            "SELECT * FROM logs WHERE `id_pc` = ?",
            equipo, 
            (err, res) => {
                if (err) throw err;

                let result = [];

                res.map(r => {
                    result.push({
                        id: r.id,
                        id_pc: r.id_pc,
                        nombre: r.nombre,
                        data: JSON.parse(r.data),
                        fecha: r.fecha
                    })
                })

                ress.json(result);
            }
        )
    }


}


const db = new dbC();
exports.db = db;