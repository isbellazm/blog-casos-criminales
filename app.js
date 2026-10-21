require("dotenv").config();

const express = require("express");
const path = require("path");
const suscriptoresRouter = require("./routes/suscriptores");
const entradasRouter = require("./routes/entradas");

const app = express();
const PUERTO = process.env.PUERTO || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/suscriptores", suscriptoresRouter);
app.use("/api/entradas", entradasRouter);

app.use("/api", (req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.listen(PUERTO, () => {
    console.log("Blog corriendo en http://localhost:" + PUERTO);
    console.log("Almacenamiento: " + (process.env.ALMACENAMIENTO === "txt" ? "txt" : "postgres"));
});
