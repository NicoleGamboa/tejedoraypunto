require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const {getProductosDB, createUserDB, getUserMailDB} = require("../database/db")

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

        // jsonwebtoken
        const payload = {id: respuesta.id}
        const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn : "24h"})

        return res.json({
            ok:true,
            token
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
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "24h"})

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



module.exports = {
    getProductos,
    createUser,
    loginUser
}



module.exports = {
    getProductos,
    createUser,
    loginUser
}