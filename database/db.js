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


const traernombreproductoDB = async () => {
    const client = await pool.connect()
    try{
        const respuesta = await client.query("SELECT producto FROM Productos;")
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
        text: "INSERT INTO usuarios (nombre,apellido,password,email,tipo_usuario) values($1,$2,$3,$4,$5) RETURNING*",
        values: [nombre,apellido,password,email,"cliente"]
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

const getUserDB = async (id) => {
    const client = await pool.connect()
    const query = {
        text: "SELECT id,nombre,apellido,email,tipo_usuario FROM usuarios WHERE id = $1",
        values:[id]
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

const crearProductoDB = async (producto,descripcion,stock,valor) => {
    const client = await pool.connect()
    const query = {
        text: "INSERT INTO productos (producto,descripcion,stock,valor) values($1,$2,$3,$4) RETURNING*",
        values: [producto,descripcion,stock,valor]
    }
    try{
        const respuesta = await client.query(query)
        return {
            ok:true,
            msg: respuesta.rows[0]
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


const eliminarProductoDB = async(id) => {
    const client = await pool.connect()
    const query = {
        text: "DELETE FROM productos WHERE id = $1 RETURNING*;",
        values: [id]
    }
    try{
        const respuesta = await client.query(query);
        return respuesta.rows;
    }catch(error){
        console.log(error)
        return error
    }finally{
        client.release()
    }
}


const editarProductoDB = async(producto,descripcion,stock,valor, id) => {
    const client = await pool.connect()
    const query = {
        text: "UPDATE productos SET producto= $1, descripcion= $2, stock= $3,valor= $4 WHERE id = $5 RETURNING*;",
        values: [producto,descripcion,stock,valor, id]
    }
    try{
        const respuesta = await client.query(query);
        return {
            ok:true,
            msg: respuesta.rows[0]
        }
    }catch(error){
        console.log(error)
        return {
            ok:false,
            msg: error.message ,
        }
    }finally{
        client.release()
    }
}
 

const insertCompraDB = async (id,usuarioId,total) => {
    const client = await pool.connect()
    const fecha = Date.now()
    const fechaActual = new Date(fecha)

    const query = {
        text: "INSERT INTO compras (id,usuario_id_fk,fecha,total) values($1,$2,$3,$4) RETURNING*",
        values: [id,usuarioId,fechaActual,total]
    }
    try{
        const respuesta = await client.query(query)
        return {
            ok:true,
            msg: respuesta.rows[0]
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

const insertDetalleDB = async (id,compraId, productoId,cantidad,precio) => {
    const client = await pool.connect()

    const query = {
        text: "INSERT INTO detalle_compras (id,compra_id_fk,producto_id_fk,cantidad,precio) values($1,$2,$3,$4,$5) RETURNING*",
        values: [id,compraId, productoId,cantidad,precio]
    }
    try{
        const respuesta = await client.query(query)
        return {
            ok:true,
            msg: respuesta.rows[0]
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

const stockProductoDB = async (stock,id) => {
    const client = await pool.connect()

    const query = {
        text: "UPDATE productos SET stock= $1 WHERE id = $2 RETURNING*;",
        values: [stock,id]
    }
    try{
        const respuesta = await client.query(query)
        return {
            ok:true,
            msg: respuesta.rows[0]
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


module.exports = {
    getProductosDB,
    traernombreproductoDB,
    createUserDB,
    getUserMailDB,
    getUserDB,
    crearProductoDB,
    eliminarProductoDB,
    editarProductoDB,
    insertCompraDB,
    insertDetalleDB,
    stockProductoDB

}