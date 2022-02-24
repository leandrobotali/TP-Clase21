const socket = io.connect();

document.querySelector("#formAgregarProduco").addEventListener("submit",async (e) =>{
    e.preventDefault();

    await fetch("/api/productos",{
        method: "post",
        headers:{
            'content-Type' : 'application/json'
        },
        body: JSON.stringify({
            titulo: document.querySelector("#inputProducto").value,
            precio: document.querySelector("#precioProducto").value,
            thumbnail: document.querySelector("#thumbnailProducto").value
        })
    })
})

document.querySelector("#formMensajes").addEventListener("submit", e=> {
    e.preventDefault();
    
    let fyh = new Date();

    let fyhActual = fyh.getDate() + '/' + ( fyh.getMonth() + 1 ) + '/' + fyh.getFullYear() + " - " + fyh.getHours() + ':' + fyh.getMinutes() + ':' + fyh.getSeconds();
    

    socket.emit("new_message", {
        email: document.querySelector("input[name=email]").value,
        hora: fyhActual,
        message: document.querySelector("input[name=message]").value
    })
})

const render = data => {
    const html = data.map(elem => {
        
        return `<div>
        <strong style = "color:blue">${elem.email}</strong>
        <em style = "color:brown">${elem.hora}: </em>
        <em style = "font-style:italic">${elem.message}</em>
        </div>`
    }).join("");
document.querySelector("#messages").innerHTML = html;
};

socket.on("messages_received", (data) => {
    render(data);
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