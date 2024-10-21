const express = require("express");
const connectdb = require("./src/config/db");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const hbs = require("hbs");
const personajeRouter = require('./src/routes/personajeRoutes');

//Cargar variables de entorno
dotenv.config();
//Conectar a la base de datos MongoDB
connectdb();

//Configurar Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
//Middleware para servir archivos estaticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '/public')));

//definir rutas relacionadas con los personajes
app.use("/personajes", personajeRouter);

app.get("/", (req,res)=>{
    res.render("index",{
        layout: "layouts/main",
        title: "Inicio",
        message : "Bienvenidos a nuestra aplicación",
        });

})
app.use((req,res, next)=>{
    res.status(404).render("error404", {title: "página no encontrada"});
})

//Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
