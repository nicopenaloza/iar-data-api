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
                "INSERT INTO logs (`id_pc`, `nombre`, `data`, `fecha`) VALUES (?, ?, ?, ?)",
                [equipo.id, equipo.nombre, JSON.stringify(equipo.data), `${new Date().toISOString().split('T')[0]}T${new Date().toTimeString().split(' ')[0]}`],
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
                let equiposEncontrados = [];

                res.map(r => {
                    if (!equiposEncontrados.includes(r.id_pc)) {
                        equiposEncontrados.push(r.id_pc)
                    };

                    result.push({
                        id: r.id,
                        id_pc: r.id_pc,
                        nombre: r.nombre,
                        data: JSON.parse(r.data),
                        fecha: r.fecha
                    })
                })

                let data = equiposEncontrados.map(e => {
                    return {
                        id: e,
                        nombre: result.find(equipo => equipo.id_pc == e).nombre,
                        data: result.filter(info => info.id_pc === e).reverse()
                    }
                })
                ress.setHeader('Access-Control-Allow-Origin', '*');
                ress.setHeader('Access-Control-Allow-Methods', 'GET');
            
                ress.json(data);
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
                ress.setHeader('Access-Control-Allow-Origin', '*');
                ress.setHeader('Access-Control-Allow-Methods', 'GET');

                ress.json({pc: equipo, data: result});
            }
        )
    }


}


const db = new dbC();
exports.db = db;