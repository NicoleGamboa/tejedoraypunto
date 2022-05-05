
require("dotenv").config()
const nodemailer = require("nodemailer")

const enviar = async (to,subject,html) =>{
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'tejedoraypunto@outlook.es',
          pass: process.env.OTRO_SECRET,
        }
    })

    const mailOptions ={
        from: 'tejedoraypunto@outlook.es',
        to,
        subject,
        html,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info)
        return {ok:true, msg: "correo enviado con exito"}
    } catch (error) {
        console.log(error)
        return {ok:false, msg:"correo fallido" }
    }

}
module.exports = enviar