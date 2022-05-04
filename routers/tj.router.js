const express = require("express");
const expressFileUpload = require("express-fileupload")

const { getProductos, crearProducto, eliminarProducto, traerNombreP, editarProducto} = require("../controllers/productos.controller");
const { infoUsuario, ordenCompra,  createUser, loginUser,  validarAdmi  } = require("../controllers/usuarios.controller");
const requiereAut = require("../middlewares/requiereAutenticacion");


const router = express.Router();

router.use(expressFileUpload())
router.use(express.urlencoded({extended: true}));
router.use(express.json());

// productos
router.get("/productos", requiereAut,getProductos)
router.get("/inicio",traerNombreP)
router.post("/agregarProducto" ,crearProducto)
router.delete("/eliminarProducto/:id",eliminarProducto)
router.put("/editar", editarProducto)
// usuarios
router.post("/createUser", createUser)
router.post("/login", loginUser)
router.get("/administacion", validarAdmi)
router.get("/usuario", infoUsuario)
router.post("/correo", ordenCompra)


module.exports = router;