const mongoose = require('mongoose');

const personajeSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    casa: { type: String, required: true },
    rol: { type: String, required: true },
    fechaEdicion: { type: String }, // Este campo debe estar definido
    imagen: { type: String, default: '' }
});

const Personaje = mongoose.model('Personaje', personajeSchema);

module.exports = Personaje;