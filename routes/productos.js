const express = require('express');
const router = express.Router();

const dbOption = require('../dbConexion/conexionMysql')

const Contenedor = require('../contenedor');

const contenedor = new Contenedor.Contenedor(dbOption,'Productos')

contenedor.isExistTable().then((isExist) => (!isExist ? contenedor.createTable() : false));

/* GET home page. */
router.get('/', function(req, res, next) {
    contenedor.getAll().then((tabla) => res.status(201).send(tabla))
});

router.get('/:id', function(req, res, next) {    
    contenedor.getById(req.params.id).then((producto) => res.status(201).send(producto))
});

router.post('/', async function(req, res, next) {
    if (req.body.titulo != undefined && req.body.precio != undefined && req.body.thumbnail != undefined) {
        await contenedor.save(req.body).then((data) =>(res.status(201).send(data)));
        
        contenedor.getAll().then((tabla) =>(req.app.io.sockets.emit("actualizarProductos", tabla)));
    }
    else{
        res.status(400).send({error: "datos incorrectos"})
    }
});

router.put('/:id', async function(req, res, next) {   
    await contenedor.updateById(req.params.id, req.body)
    contenedor.getAll().then((tabla) => res.status(201).send(tabla))
});

router.delete('/:id', async function(req, res, next) {
    await contenedor.deleteById(req.params.id)
    contenedor.getAll().then((tabla) => res.status(201).send(tabla))
});

module.exports = {router, contenedor};