/* jshint esversion:6 */

const express = require('express');
const config = require('./config');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const dbController = require('./modulos/dbController');

app.use(cors());


const traerDatosPeriodicos = async () => {
    setTimeout(async () => {
        
        let respuesta = [];

        for (const e of config.equipos){
            await fetch('http://' + e.ip + ':' + e.puerto + '/info')
            .then(r => r.text())
            .then(body => JSON.parse(body))
            .then(data => respuesta.push({id: e.id, nombre: e.nombre, data}))
            .catch(err => console.error(err));
        }

        dbController.db.guardarNuevaEntrada(respuesta);

        traerDatosPeriodicos();
    }, 300000); // 300000ms = 5min
}


app.listen(config.puerto, () => { // Especifico que el servidor API va a iniciar en el puerto config.puerto
    console.log('API iniciada en el puerto:', config.puerto);
    traerDatosPeriodicos();
});

app.get('/iar/api/getone/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Origin', '*');

    dbController.db.traerLogsDeUnEquipo(req.params.id, res);
});

app.get('/iar/api/getall', async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    dbController.db.traerLogs(res);
});