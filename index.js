const express = require("express")
const {create} = require("express-handlebars");
const expressFileUpload = require("express-fileupload")


const app = express()
 
const PORT = process.env.PORT || 3000


// midleware
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(expressFileUpload())


app.use(express.static(__dirname + "/public"))


const hbs = create({
    partialsDir:["views/partials"],
    extname:".hbs",
})

// motor de plantilla 
app.engine(".hbs", hbs.engine)
app.set('view engine' , '.hbs')
app.set('views' , './views')





app.use("/api", require("./routers/tj.router"))
app.use("/", require("./routers/vistas.router"))


app.listen(PORT, console.log("servidor activo puerto: ",PORT))