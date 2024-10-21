const Personaje = require('../models/personajeModel');
const generateTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};
//Obtener todos los personajes
const getAllPersonajes = async (req, res) =>{
    try{
        const personajes = await Personaje.find();
        res.render("personajes", {layout: "layouts/main", personajes});
    }
    catch(error){
        console.error("Error al obtener personajes");
        res.status(500).send("Hubo un error al obtener los personajes");
    }
};


//Crear un nuevo personaje
const createPersonaje = async(req, res)=>{
    const {nombre, edad, casa, rol} = req.body;
    const imagenPath = req.file ? req.file.filename : "";
    if (!nombre || isNaN(parseInt(edad)) || !casa || !rol) {
        return res.render("crearPersonaje", {
            layout: "layouts/main",
            error: "Todos los campos son obligatorios y la edad debe ser un número",
            nombre,
            edad,
            casa,
            rol,
            imagen:imagenPath
        });
    }

    try{
        const nuevoPersonaje = new Personaje({
            nombre,
            edad: parseInt(edad),
            casa,
            rol,
            imagen: imagenPath,
        });
        await nuevoPersonaje.save();
        const uploadDetails = {
            filename: req.file.originalname,   // Nombre original del archivo
            filetype: req.file.mimetype,      // Tipo MIME del archivo
            filesize: req.file.size           // Tamaño del archivo
        };
        res.render("formulario", {
            layout: "layouts/main",
            success: "El archivo ha sido subido correctamente.",
            uploadDetails
        });
        // res.redirect("/personajes");
    }
    catch(error){
        console.error("Error al crear personaje", error)
        res.status(500).send("Hubo un error al crear el personaje");
    }
}
const editPersonaje = async(req, res)=>{
    // const {nombre, edad, casa, rol} = req.body;
    try{
        const personaje = await Personaje.findById(req.params.id);
        if(!personaje){
        return res.status(404).send("Personaje no encontrado");
        }
        res.render("editPersonaje", {layout: "layouts/main", personaje})
    }
    catch(error){
        console.error("Error al obtener personaje", error)
        res.status(500).send("Hubo un error al obtener el personaje");
    }
}
const updatePersonaje = async(req, res)=>{

    const {nombre, edad, casa, rol} = req.body;
    const imagenPath = req.file ? req.file.filename : "";
    if (!nombre || isNaN(parseInt(edad)) || !casa || !rol) {
        return res.status(400).send("Todos los campos son obligatorios y la edad debe ser un número");
    }
    const personajeId = req.params.id.trim(); //Eliminar espacios

    try{
        const personajeActualizado = await Personaje.findByIdAndUpdate(req.params.id, {
            nombre,
            edad: parseInt(edad),
            casa, 
            rol,
            imagen:imagenPath,
            fechaEdicion: generateTimestamp() // Usa la función para establecer la fecha de edición
        }, { new: true }); // 'new: true' para devolver el documento actualizado

        if (!personajeActualizado) {
            return res.status(404).send("Personaje no encontrado");
        }
        console.log(personajeActualizado.fechaEdicion); 
        res.redirect("/personajes");
    }
    catch(error){
        console.error("Error al actualizar personaje", error);
        res.status(500).send("Hubo un error al actualizar el personaje");
    }
}
//Eliminar un personaje
const deletePersonaje = async(req, res)=>{
    try{
        await Personaje.findByIdAndDelete(req.params.id);
       res.redirect("/personajes");
        }
    catch(error){
        console.error("Error al eliminar personaje", error)
        res.status(500).send("Hubo un error al eliminar el personaje");
    }
}

module.exports= {
    getAllPersonajes,
    createPersonaje,
    editPersonaje,
    updatePersonaje,
    deletePersonaje
}