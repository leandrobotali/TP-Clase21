const Contenedor = require ('../../contenedor')

const dbOptionSqlite = require('../../dbConexion/conexionMysql')

const contenedor = new Contenedor.Contenedor(dbOptionSqlite,'Mensajes')

async function crearTabla(){
    
    await contenedor.isExistTable().then((isExist) => (!isExist ? contenedor.createTableMensajes() : false));

}

crearTabla()

module.exports = contenedor