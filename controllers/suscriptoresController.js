const { suscriptorDAO } = require("../dao");
const { esCorreoValido, normalizarCorreo } = require("../utils/validaciones");
const { tokenBaja, enviarConfirmacion } = require("../utils/correo");

async function suscribir(req, res) {
    const correoRecibido = req.body.correo;

    if (!esCorreoValido(correoRecibido)) {
        return res.status(400).json({ mensaje: "Ingresa un correo valido" });
    }

    const correo = normalizarCorreo(correoRecibido);

    try {
        if (await suscriptorDAO.existe(correo)) {
            return res.status(200).json({ mensaje: "Ya estabas suscrito" });
        }
        await suscriptorDAO.guardar(correo);
        enviarConfirmacion(correo);
        res.status(201).json({ mensaje: "Suscripcion registrada" });
    } catch (error) {
        console.error("Error al suscribir: " + error.message);
        res.status(500).json({ mensaje: "No se pudo guardar la suscripcion" });
    }
}

async function listarSuscriptores(req, res) {
    try {
        const suscriptores = await suscriptorDAO.listar();
        res.status(200).json({ total: suscriptores.length, suscriptores });
    } catch (error) {
        res.status(500).json({ mensaje: "No se pudo leer la lista de suscriptores" });
    }
}

async function darDeBaja(req, res) {
    const correo = normalizarCorreo(String(req.query.correo || ""));
    const token = String(req.query.token || "");

    if (!esCorreoValido(correo) || token !== tokenBaja(correo)) {
        return res.status(400).send(paginaSimple("Enlace no valido", "El enlace de baja no es correcto."));
    }

    try {
        await suscriptorDAO.eliminar(correo);
        res.status(200).send(paginaSimple("Listo", "Ya no recibiras correos de Casos Criminales."));
    } catch (error) {
        res.status(500).send(paginaSimple("Error", "No se pudo procesar la baja, intenta mas tarde."));
    }
}

function paginaSimple(titulo, texto) {
    return "<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"UTF-8\"><title>" + titulo + "</title>"
        + "<link rel=\"stylesheet\" href=\"/styles.css\"></head>"
        + "<body><div class=\"wrap\" style=\"padding:80px 28px;\"><h1 style=\"font-family:var(--font-display);font-size:48px;\">"
        + titulo + "</h1><p style=\"margin-top:12px;\">" + texto + "</p>"
        + "<p style=\"margin-top:24px;\"><a href=\"/\" style=\"color:var(--blood);\">Volver al blog</a></p></div></body></html>";
}

module.exports = {
    suscribir,
    listarSuscriptores,
    darDeBaja
};
