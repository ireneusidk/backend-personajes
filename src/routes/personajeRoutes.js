const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const personajesController = require("../controllers/personajesController");
//Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/uploads")); //Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); //Agrega un timestamp al nombre del archivo
    }
  })
  


  //Filtra para validar formato
  const fileFilter = (req, file, cb)=>{
    const filetypes = /jpeg|jpg|png|gif|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null, true)
    }else{
        cb("Error: el archivo debe ser una imagen(jpeg, jpg, png, gif"); //archivo no válido
    }
  }
  const upload = multer({ storage: storage, 
    fileFilter:fileFilter
  });
//Ruta para mostrar personajes 
router.get("/", personajesController.getAllPersonajes);

//Ruta para mostrar formulario
router.get("/crear", (req,res)=>{
    res.render("formulario", {layout : "layouts/main"});
});

router.post("/crear", upload.single("imagen"), personajesController.createPersonaje);

//Ruta para mostrar el formulario de edicion
router.get("/edit/:id", personajesController.editPersonaje);
//Ruta para manejar la actualizacion de un personaje
router.post("/edit/:id", upload.single("imagen"), personajesController.updatePersonaje);
//Ruta para eliminar personaje
router.get("/delete/:id", personajesController.deletePersonaje);
module.exports = router;