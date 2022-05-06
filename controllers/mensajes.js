const db = require('../dbConexion/db');

const query = db.collection('mensajes')

const getAllMessage = async ()=>{
    try{
        const messageALL = await query.get();
        const message = messageALL.docs.map((doc)=>({
            ...doc.data()
        }))
        return(message)
    }catch(err){
        console.log(err);
    }    
}

const createMessage = async (data)=>{
    try{
        const arrayMsj = await getAllMessage()
        let idMasAlto = 0;
        if (arrayMsj.length > 0) {
            idMasAlto = arrayMsj.reduce((acum, proximo) => acum > proximo.id ? acum : proximo.id, 0);
        }
        const idObj = idMasAlto + 1
        const {author, message} = data
        await query.add({
            id: idObj,
            author,
            message
        })
    }catch(err){
        console.log(err);
    }
}



module.exports = {getAllMessage,createMessage}