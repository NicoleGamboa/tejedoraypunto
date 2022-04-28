const pool = require("./migrate")

const getProductosDB = async () => {
    const client = await pool.connect()
    try{
        const respuesta = await client.query("SELECT * FROM Productos;")
        return {
            ok:true,
            msg: respuesta.rows,
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}


const createUserDB = async (nombre,apellido,password,email) => {
    const client = await pool.connect()
    const query = {
        text: "INSERT INTO usuarios (nombre,apellido,password,email) values($1,$2,$3,$4) RETURNING*",
        values: [nombre,apellido,password,email]
    }
    try{
        const respuesta = await client.query(query)
        const {id} = respuesta.rows[0]

        return {
            ok:true,
            id,
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}

const getUserMailDB = async (email) => {
    const client = await pool.connect()
    const query = {
        text: "SELECT * FROM usuarios WHERE email = $1",
        values:[email]
    }
    try{
        const respuesta = await client.query(query)
        return {
            ok:true,
            msg: respuesta.rows[0],
        }
    }catch(e){
        console.log(e)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}

// const createProducto = async (producto,descripcion,stock,valor) => {
//     const client = await pool.connect()
//     const query = {
//         text: "INSERT INTO productos (producto,descripcion,stock,valor) values($1,$2,$3,$4) RETURNING*",
//         values: [producto,descripcion,stock,valor]
//     }
//     try{
//         const respuesta = await client.query(query)
//         return {
//             ok:true,
//             msg: respuesta.rows[0]
//         }
//     }catch(e){
//         console.log(e)
//         return {
//             ok:false,
//             msg: error.message ,
//         }
//     }finally{
//         client.release()
//     }
// }




module.exports = {
    getProductosDB,
    createUserDB,
    getUserMailDB,
    // createProducto
}