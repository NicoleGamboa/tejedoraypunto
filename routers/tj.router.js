const express = require("express");
const { getProductos, createUser, loginUser } = require("../controllers/tj.controller");


const router = express.Router();



router.use(express.urlencoded({extended: true}))



router.get("/productos", getProductos)
router.post("/create", createUser)
router.post("/login", loginUser)


module.exports = router;