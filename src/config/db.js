const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const connecDB = async () =>{
    try{
        await mongoose.connect(MONGODB_URI,{});
        console.log('Conexion a MongoDb exitosa');
    }
    catch(error){
        console.log('Error al conectar a MONGODB:', error);
        process.exit(1);
    }
};
module.exports = connecDB;