const socket = io.connect();


document.querySelector("#formAgregarProduco").addEventListener("submit",async (e) =>{
    e.preventDefault();

    await fetch("/api/productos-test",{
        method: "get",
        headers:{
            'content-Type' : 'application/json'
        },
    })
})

document.querySelector("#formMensajes").addEventListener("submit", e=> {
    e.preventDefault();
    console.log('123');
    let fyh = new Date();

    let fyhActual = fyh.getDate() + '/' + ( fyh.getMonth() + 1 ) + '/' + fyh.getFullYear() + " - " + fyh.getHours() + ':' + fyh.getMinutes() + ':' + fyh.getSeconds();

    socket.emit("new_message", {
        author:{
            email: document.querySelector("input[name=email]").value,
            nombre: document.querySelector("input[name=nombre]").value,
            apellido: document.querySelector("input[name=apellido]").value,
            edad: document.querySelector("input[name=edad]").value,
            alias: document.querySelector("input[name=alias]").value,
            avatar: document.querySelector("input[name=avatar]").value,
        },
        message:{
            text: document.querySelector("input[name=message]").value,
            author: document.querySelector("input[name=email]").value,
            hora: fyhActual
        }
    })
})


// const deNomalizarData = (data) => {

//     const autorSchema = new schema.Entity('authors',{},{idAttribute:'email'})

//     const mensajeSchema = new schema.Entity('messages',{},{idAttribute:'hora'})

//     const postSchema = new schema.Entity('post', {
//         author: [autorSchema],
//         messages: [mensajeSchema]
//     })


//     const denormalizeObj = denormalize(data.result, postSchema, data.entities);
//     console.log(denormalizeObj);

//     return denormalizeObj
// }



const render = (data) => {
    const html = data.map(elem => {
        
        return `<div>
        <strong style = "color:blue">${elem.id}</strong>
        <em style = "color:brown">${elem.author}: </em>
        <em style = "font-style:italic">${elem.messages}</em>
        </div>`
    }).join("");
document.querySelector("#messages").innerHTML = html;
};

socket.on("messages_received", async (data) => { 
    document.querySelector("#messages").innerHTML = data;
    // const deMsj = await deNomalizarData(data)
    // render(deMsj)
})

socket.on("actualizarProductos", async data => {
    mostrarProductos(data);
})

async function mostrarProductos (data) {
    const fetchTemplateHBS = await fetch("../views/list_products.hbs");
    const templateHBS = await fetchTemplateHBS.text();
    const template = Handlebars.compile(templateHBS);
    const html = template({products: data});
    document.querySelector("#list_Productos").innerHTML = html
}