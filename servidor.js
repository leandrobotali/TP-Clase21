const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const path = require('path');
const { faker } = require('@faker-js/faker')
const morgan = require('morgan')
const {normalize, denormalize, schema} = require('normalizr')

const util = require('util')
function print(objeto) {
    console.log(util.inspect(objeto,false,12,true))
}

const {getAllMessage,createMessage} = require('./controllers/mensajes')
const router = express.Router();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//-------------------------------------
//-------------------------------------

const generarProductos = () =>{
    const productos = []
    
    for (let index = 0; index < 5; index++) {
        const obj = {
            titulo: faker.name.findName(),
            precio: faker.commerce.price(),
            thumbnail: faker.image.imageUrl()
        }
        productos.push(obj)
    }

    return productos
}

router.get('/', (req,res) => {
    const productos = generarProductos()
    res.status(200).send(io.sockets.emit("actualizarProductos", productos))
} );

app.use('/api/productos-test', router);

//----------------------------------------
//----------------------------------------

const nomalizarData = (data) => {
    const chat = {
        id: 'mensajes',
        post: []
    }

    chat.post = data

    const autorSchema = new schema.Entity('authors',{},{idAttribute:'email'})

    const mensajeSchema = new schema.Entity('messages',{},{idAttribute:'hora'})

    const postSchema = new schema.Entity('post', {
        author: [autorSchema],
        messages: [mensajeSchema]
    })


    const normalizeObj = normalize(chat, postSchema);

    return normalizeObj
}

io.on("connection", async (socket) => {
    console.log("Se ha conectado un cliente");
    socket.on("new_message", async data => {
        await createMessage(data);
        // getAllMessage().then(async (data) => io.sockets.emit("messages_received", {mensaje:"aca van los mensajes"})) 
        getAllMessage().then(async (data) => io.sockets.emit("messages_received", await nomalizarData(data))) 
    })   
    getAllMessage().then(async (data) => io.sockets.emit("messages_received", await nomalizarData(data))) 
    // getAllMessage().then((data) => print(nomalizarData(data)))
})

//--------------------------------------
//--------------------------------------

app.use((req, res) => {
    res.json({
    error: {
        error: -2,
        descripcion: `Ruta ${req.originalUrl} y metodo ${req.method} no implementados`
}})});


//-------------------------------------
//-------------------------------------

const server = httpServer.listen(8080,() => {
    console.log(`puerto ${server.address().port}`);
})