const {getProductosDB, crearProductoDB, editarProductoDB, eliminarProductoDB, traernombreproductoDB} = require("../database/db")

const getProductos = async(req,res) => {
    const respuesta = await getProductosDB();
    if(!respuesta.ok){
        return res.status(500).json({
            ok:false,
            msg: respuesta.msg})
    }
    return res.json({
        ok:true,
        msg: respuesta.msg})

    }

const traerNombreP = async(req,res) => {
        const respuesta = await traernombreproductoDB();
        if(!respuesta.ok){
            return res.status(500).json({
                ok:false,
                msg: respuesta.msg})
        }
        return res.json({
            ok:true,
            msg: respuesta.msg})
    
        }


const crearProducto = async(req,res) => {
    const {producto,descripcion,stock,valor} = req.body;
    // const {foto} = req.files;
    // console.log(req.files)
    // const mimetypes = ["image/jpeg", "image/png"]
    try {
        // validacion de campos
        if(!producto?.trim() || !descripcion?.trim() ||
        !stock?.trim() || !valor?.trim()){
            throw new Error("Todos los campos son obligatorios")
        }
        // if(!mimetypes.includes(foto.mimetype)){
        //     throw new Error("Debes seleccionar solo archivos jpeg o png")
        // }
        // // crear path para foto y guardarla en servidor 
        // const pathFoto = `${nanoid()}.${foto.mimetype.split("/")[1]}`
        // const rutaFoto = path.join(__dirname,"../public/img",pathFoto) //path.join para unir e interpretar ruta 
        
        // foto.mv(rutaFoto , (err) =>{
        //     if(err) throw new Error("Error al cargar la imagen")
            
        // })

        const respuesta = await crearProductoDB(producto,descripcion,stock,valor)
        if(!respuesta.ok) throw new Error(respuesta.msg);

        return res.json({
            ok:true,
            msg:respuesta.msg
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })
    }
}

const eliminarProducto = async(req,res) => {
    const {id} = req.params;
    try {
        const respuesta = await eliminarProductoDB(id)
        return res.json({
            ok:true,
            msg:respuesta.msg
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })
    }
}

const editarProducto = async(req,res) => {
    const {producto,descripcion,stock,valor} = req.body;
    console.log(req.body)
    try {
        // validacion de campos
        if(!producto?.trim() || !descripcion?.trim() ||
        !stock?.trim() || !valor?.trim()){
            throw new Error("Todos los campos son obligatorios")
        }

        const respuesta = await editarProductoDB(producto,descripcion,stock,valor)
        return res.json({
            ok:true,
            msg:respuesta.msg
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })
    }
}

module.exports = {
    getProductos,
    traerNombreP,
    crearProducto,
    eliminarProducto,
    editarProducto,
}