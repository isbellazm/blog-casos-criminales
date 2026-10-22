const { entradaDAO, suscriptorDAO } = require("../dao");
const { esTextoValido } = require("../utils/validaciones");
const { notificarSuscriptores } = require("../utils/correo");

async function publicarEntrada(req, res) {
    const { titulo, resumen, enlace } = req.body;

    if (!esTextoValido(titulo)) {
        return res.status(400).json({ mensaje: "El titulo es obligatorio" });
    } else if (!esTextoValido(resumen)) {
        return res.status(400).json({ mensaje: "El resumen es obligatorio" });
    }

    try {
        const entrada = await entradaDAO.guardar({
            titulo: titulo.trim(),
            resumen: resumen.trim(),
            enlace: esTextoValido(enlace) ? enlace.trim() : ""
        });

        const suscriptores = await suscriptorDAO.listar();
        const correos = suscriptores.map((s) => s.correo);
        const envio = await notificarSuscriptores(entrada, correos);

        res.status(201).json({
            mensaje: "Entrada publicada",
            entrada,
            suscriptores: correos.length,
            correosEnviados: envio.enviados,
            correosFallidos: envio.fallidos,
            correoConfigurado: envio.configurado
        });
    } catch (error) {
        console.error("Error al publicar: " + error.message);
        res.status(500).json({ mensaje: "No se pudo publicar la entrada" });
    }
}

async function listarEntradas(req, res) {
    try {
        res.status(200).json(await entradaDAO.listar());
    } catch (error) {
        res.status(500).json({ mensaje: "No se pudieron leer las entradas" });
    }
}

module.exports = {
    publicarEntrada,
    listarEntradas
};
