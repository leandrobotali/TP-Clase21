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

    let fyhActual = fyh.getHours() + ':' + fyh.getMinutes() + ':' + fyh.getSeconds();

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


const deNomalizarData = (data) => {

    const autorSchema = new normalizr.schema.Entity('authors',{},{idAttribute:'email'})

    const mensajeSchema = new normalizr.schema.Entity('messages',{},{idAttribute:'hora'})

    const postSchema = new normalizr.schema.Entity('post', {
        author: [autorSchema],
        messages: [mensajeSchema]
    })


    const denormalizeObj = normalizr.denormalize(data.result, postSchema, data.entities);
    console.log(denormalizeObj);

    return denormalizeObj
}



socket.on("messages_received", async (data) => {
    const deMsj = await deNomalizarData(data)

    let porc = ((JSON.stringify(data).length*100)/ JSON.stringify(deMsj).length)

    const porcentaje = `<strong style = "color:blue">El porcentaje de compresion es de ${porc} %</strong>`

    const arrayMensajes = []
    deMsj.post.forEach(element => {
        arrayMensajes.push({
            id: element.id,
            email: element.author.email,
            hora: element.message.hora,
            message: element.message.text
        })
    });
    arrayMensajes.sort(((a, b) => a.id - b.id))

    const html = arrayMensajes.map(elem => {

        return `<div>
        <strong style = "color:blue">${elem.email}</strong>
        <em style = "color:brown">${elem.hora}: </em>
        <em style = "font-style:italic">${elem.message}</em>
        </div>`
    }).join("");
    document.querySelector("#messages").innerHTML = html
    document.querySelector("#compresion").innerHTML = porcentaje
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