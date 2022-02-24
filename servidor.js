const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const contenedorMsj = require ('./public/js/mensajes')


const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const path = require('path');

const productosRouter = require('./routes/productos');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/productos', productosRouter.router);

io.on("connection", (socket) => {
    console.log("Se ha conectado un cliente");
    productosRouter.contenedor.getAll().then((data) => io.sockets.emit("actualizarProductos", data))
    socket.on("new_message", async data => {
        await contenedorMsj.save(data);
        contenedorMsj.getAll().then((tabla) => io.sockets.emit("messages_received", tabla))     
    })
    contenedorMsj.getAll().then((tabla) => io.sockets.emit("messages_received", tabla))
})


// app.use(function(req,res,next){
//     req.io = io;
//     next();
// })

app.io = io;

app.use((req, res) => {
    res.json({
    error: {
        error: -2,
        descripcion: `Ruta ${req.originalUrl} y metodo ${req.method} no implementados`
}})});


httpServer.listen(8080)

// const server = app.listen(8080,() => {
//     console.log(`puerto ${server.address().port}`);
// })