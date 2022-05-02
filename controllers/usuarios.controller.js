require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {v4 : uuidv4} = require ("uuid"); 

const { createUserDB, getUserMailDB,getUserDB, insertCompraDB} = require("../database/db")

const enviar = require("../nodemailer/nodemailer")


const createUser = async(req,res) => {
    const {nombre,apellido,password,email} = req.body;
    console.log(req.body)
    try {
        // validacion de campos
        if(!nombre?.trim() || !apellido?.trim() ||
        !password?.trim() || !email?.trim()){
            throw new Error("Todos los campos son obligatorios")
        }

        // reconocer si el usuario ya esta registrado
        const userResgitrado = await getUserMailDB(email)
        if(!userResgitrado.ok){
            throw new Error(userResgitrado.msg)
        }
        if(userResgitrado.msg){
            throw new Error("Este email ya esta registrado")
        }
        // hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        
        const respuesta = await createUserDB(nombre,apellido,hashPassword,email)
        if(!respuesta.ok) throw new Error(respuesta.msg);


        return res.json({
            ok:true,
            msg: respuesta.msg,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok:false,
            msg: error.message
        })
    }
}

const loginUser =  async(req,res) => {
    const {email, password} = req.body;
    try {
        if(!email?.trim() ||
        !password?.trim()){
            throw new Error("Todos los campos son obligatorios")
        }
        
        const respuesta = await getUserMailDB(email)
        if(!respuesta.ok){
            throw new Error(respuesta.msg)
        }
        if(!respuesta.msg){
            throw new Error("No existe el email registrado")
        }
        // validar que password coincide con el hash
        const {msg} = respuesta
        const comparePassword = await bcrypt.compare(password, msg.password)
        if(!comparePassword){ 
            throw new Error("Contraseña incorrecta")
         }

         // generar token
        const payload = {id : msg.id}
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        return res.json({
            ok:true,
            token,
        })

    } catch (error) {
        // console.log(error)
    return res.status(400).json({
        ok:false,
        msg: error.message
    })
    }
}


const validarAdmi = async (req,res) => {
    try {
        if (!req.headers?.authorization) {
            throw new Error("No existe el token");
        }
        // console.log(req.headers.authorization.split(' ')[1])

        const token = req.headers.authorization.split(' ')[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const idUsuario = payload.id

        const respuesta = await getUserDB(idUsuario)


        if(respuesta.msg.tipo_usuario == 'administrador'){
          return res.json({
            ok:true,
            msg: 'administrador'
        })
        }
        if(respuesta.msg.tipo_usuario == 'cliente'){
            return res.json({
                ok:false,
                msg: 'cliente'
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok:false,
            msg: error.message
        })
    }
}


const infoUsuario = async (req,res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const idUsuario = payload.id

        const respuesta = await getUserDB (idUsuario)

        return res.json({
            ok:true,
            msg: respuesta.msg
        })

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok:false,
            msg: error.message
        })
    }
}


// id aleatorio 

const ordenCompra = async (req,res) => {
    const idcompras = uuidv4().slice(0,6)
    const carritoParse = JSON.parse(req.body[0])
    const usuarioParse = JSON.parse(req.body[1])
    const valorTotal  = Object.values(carritoParse).reduce((acc,{cantidad, valor}) => acc + cantidad * valor,0)

    try {
        
         await insertCompraDB(idcompras, usuarioParse.id,valorTotal)


        const subject = `Bienvenido a Tejedora y Punto `
        const html = `
        <h5>Hola ${usuarioParse.nombre} ${usuarioParse.apellido}</h5>
        <p>Hemos recibido correctamente tu pedido </p>
        <p>Este es el ID de tu compra: ${idcompras}</p>
        <p>Este es el TOTAL de tu compra: ${valorTotal}</p>

        
        <p>Para finalizar tu compra, te dejamos los datos de transferencia para que hagas el pago de tu pedido a la siguientes cuenta</p>
        
        
        <p>Una vez realizada la transferencia, debes enviar tu comprobante de pago al correo tejedoraypunto@hotmail.com y en el asunto indicar el ID de tu compra para 
        validar el pago y gestion a la brevedad la entrega de tu/tus productos </p>
        <br>
        <p>Agredecemos tu preferencia</p>
        
        <h5>Atte:</5>
        <h5>Equipo Tejedora y Punto </h5>
        `

         const correo = await enviar(usuarioParse.email,subject,html)
        if(!correo.ok) console.log(correo.msg)
        if(correo.ok) console.log(correo.msg)
       
        return res.json({
            ok:true,
            msg: correo.msg
        })

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok:false,
            msg: error.message
        })
    }
}



module.exports = {
    createUser,
    loginUser,
    validarAdmi,
    infoUsuario,
    ordenCompra
}