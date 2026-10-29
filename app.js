require("dotenv").config();

const express = require("express");
const path = require("path");
const suscriptoresRouter = require("./routes/suscriptores");
const entradasRouter = require("./routes/entradas");
const { crearTablas } = require("./db/crearTablas");

const app = express();
const PUERTO = process.env.PORT || process.env.PUERTO || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/suscriptores", suscriptoresRouter);
app.use("/api/entradas", entradasRouter);

app.use("/api", (req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

async function iniciar() {
    if (process.env.ALMACENAMIENTO !== "txt") {
        try {
            await crearTablas();
        } catch (error) {
            console.error("No se pudo preparar la base de datos: " + error.message);
            process.exit(1);
        }
    }

    app.listen(PUERTO, () => {
        console.log("Blog corriendo en el puerto " + PUERTO);
        console.log("Almacenamiento: " + (process.env.ALMACENAMIENTO === "txt" ? "txt" : "postgres"));
    });
}

iniciar();
