const knex = require('knex');

class Contenedor{
    constructor(dbOption, table){
        this.conex = knex(dbOption);
        this.table = table;
    }

    createTable() {
        return this.conex.schema.createTable(this.table, (table) => {
            table.increments("id").primary().notNullable();
            table.string("titulo", 15).notNullable();
            table.float("precio");
            table.string("thumbnail").notNullable();
        });
    }
    
    isExistTable() {
        return this.conex.schema.hasTable(this.table)
    }
    
    
    save(objeto){
        return this.conex(this.table).insert(objeto);    
    }

    getAll(){
        return this.conex(this.table);
    }

    getById(id) {
        return this.conex(this.table).where("id", id)
    }

    updateById(id, objeto){
        return this.conex(this.table).where("id", id).update(objeto);
    }

    deleteById(id) {
        return this.conex(this.table).where( "id", id ).del()
    }
    
    destroy() {
        this.conex.destroy();
    }

    createTableMensajes() {
        return this.conex.schema.createTable(this.table, (table) => {
            table.increments("id").primary().notNullable();
            table.string("email", 50).notNullable();
            table.string("hora");
            table.string("message");
        });
    }
}


//     save(mensajes) {
//         let pormesa = new Promise((resolve, reject) => {
//             let arrayMensajes = JSON.stringify(mensajes);
//             fs.promises.writeFile(`./public/${this.nombreArchivo}`, arrayMensajes)
//                 .then(
//                     resolve("mensajes guardados")
//                 )
//                 .catch(err => {
//                     reject(console.log(err));

//                 })
//         })
//         return pormesa;
//     }

//     getAll(){
//         let pormesa = new Promise((resolve, reject) => {
//             fs.promises.readFile(`./public/${this.nombreArchivo}`, 'utf-8')
//                 .then(contenido => {
//                     let arrayProductos = JSON.parse(contenido, 'utf-8');
//                     resolve(arrayProductos);
//                 })
//                 .catch(err => {
//                     reject('error de lectura');

//                 })
//         })
//         return pormesa;
//     }
// }

module.exports = {Contenedor}