/* jshint esversion:6 */

const express = require('express');
const config = require('./config');
const fetch = require('node-fetch');
const app = express();

app.listen(config.puerto, () => { // Especifico que el servidor API va a iniciar en el puerto config.puerto
    console.log('API iniciada en el puerto:', config.puerto);
});

app.get('/iar/api/:id', (req, res) => {
    res.send('Te estoy trayendo los datos de "' + req.params.id + '"');
});

app.get('/iar/api/test/allData', async (req, res) => {
    
    let respuesta = [];

    for (const e of config.equipos){
        await fetch('http://' + e.ip + ':' + e.puerto + '/info')
        .then(r => r.text())
        .then(body => JSON.parse(body))
        .then(data => respuesta.push({equipo: e.nombre, data}))
        .catch(err => console.error(err));
    }

    res.send(respuesta)
});