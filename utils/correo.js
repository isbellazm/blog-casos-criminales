const nodemailer = require("nodemailer");
const crypto = require("crypto");

let transporte = null;

function correoConfigurado() {
    return Boolean(process.env.CORREO_USUARIO && process.env.CORREO_CLAVE);
}

function obtenerTransporte() {
    if (transporte === null) {
        transporte = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.CORREO_USUARIO,
                pass: process.env.CORREO_CLAVE
            }
        });
    }
    return transporte;
}

function escaparHtml(texto) {
    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function tokenBaja(correo) {
    return crypto.createHmac("sha256", process.env.ADMIN_CLAVE || "blog")
        .update(correo)
        .digest("hex")
        .slice(0, 24);
}

function enlaceBaja(correo) {
    const sitio = process.env.URL_SITIO || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";
    return sitio + "/api/suscriptores/baja?correo=" + encodeURIComponent(correo) + "&token=" + tokenBaja(correo);
}

function armarHtml(entrada, correo) {
    const sitio = process.env.URL_SITIO || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";
    const enlace = entrada.enlace || sitio;
    return `
<div style="background:#0c0c10;padding:32px 0;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#151318;border-top:6px solid #d81e3f;padding:28px;color:#efe9de;">
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;color:#b9b2a3;">NUEVO EXPEDIENTE &middot; CASOS.CRIMINALES</p>
    <h1 style="margin:0 0 16px;font-size:26px;color:#efe9de;">${escaparHtml(entrada.titulo)}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#efe9de;">${escaparHtml(entrada.resumen)}</p>
    <a href="${escaparHtml(enlace)}" style="display:inline-block;background:#d81e3f;color:#efe9de;padding:12px 22px;text-decoration:none;font-weight:bold;letter-spacing:1px;">LEER EL EXPEDIENTE</a>
    <p style="margin:28px 0 0;font-size:11px;color:#b9b2a3;">Recibes este correo porque te suscribiste a Casos Criminales.
      <a href="${enlaceBaja(correo)}" style="color:#b9b2a3;">Darme de baja</a></p>
  </div>
</div>`;
}

function armarTexto(entrada, correo) {
    const sitio = process.env.URL_SITIO || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";
    return "Nuevo expediente en Casos Criminales\n\n"
        + entrada.titulo + "\n\n"
        + entrada.resumen + "\n\n"
        + "Leer: " + (entrada.enlace || sitio) + "\n\n"
        + "Darme de baja: " + enlaceBaja(correo);
}

function armarHtmlConfirmacion(correo) {
    const sitio = process.env.URL_SITIO || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";
    return `
<div style="background:#0c0c10;padding:32px 0;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#151318;border-top:6px solid #d81e3f;padding:28px;color:#efe9de;">
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;color:#b9b2a3;">SUSCRIPCION CONFIRMADA &middot; CASOS.CRIMINALES</p>
    <h1 style="margin:0 0 16px;font-size:26px;color:#efe9de;">Ya eres parte de la investigacion</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#efe9de;">Tu correo ${escaparHtml(correo)} quedo suscrito. Cada vez que publiquemos un expediente nuevo te llegara un aviso aqui.</p>
    <a href="${escaparHtml(sitio)}" style="display:inline-block;background:#d81e3f;color:#efe9de;padding:12px 22px;text-decoration:none;font-weight:bold;letter-spacing:1px;">VISITAR EL BLOG</a>
    <p style="margin:28px 0 0;font-size:11px;color:#b9b2a3;">Si no fuiste tu quien se suscribio,
      <a href="${enlaceBaja(correo)}" style="color:#b9b2a3;">date de baja aqui</a>.</p>
  </div>
</div>`;
}

async function enviarConfirmacion(correo) {
    if (!correoConfigurado()) {
        console.warn("CORREO_USUARIO o CORREO_CLAVE no estan en el .env, no se envio la confirmacion.");
        return false;
    }

    const sitio = process.env.URL_SITIO || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";
    const remitente = '"' + (process.env.CORREO_NOMBRE || "Casos Criminales") + '" <' + process.env.CORREO_USUARIO + ">";

    try {
        await obtenerTransporte().sendMail({
            from: remitente,
            to: correo,
            subject: "Confirmacion de suscripcion a Casos Criminales",
            text: "Tu suscripcion a Casos Criminales quedo confirmada.\n\nCada vez que publiquemos un expediente nuevo te llegara un aviso.\n\n"
                + "Blog: " + sitio + "\nDarme de baja: " + enlaceBaja(correo),
            html: armarHtmlConfirmacion(correo)
        });
        return true;
    } catch (error) {
        console.error("Error enviando la confirmacion: " + error.message);
        return false;
    }
}

async function notificarSuscriptores(entrada, correos) {
    if (!correoConfigurado()) {
        console.warn("CORREO_USUARIO o CORREO_CLAVE no estan en el .env, no se enviaron correos.");
        return { enviados: 0, fallidos: 0, configurado: false };
    }

    const remitente = '"' + (process.env.CORREO_NOMBRE || "Casos Criminales") + '" <' + process.env.CORREO_USUARIO + ">";

    const resultados = await Promise.allSettled(correos.map((correo) =>
        obtenerTransporte().sendMail({
            from: remitente,
            to: correo,
            subject: "Nuevo expediente: " + entrada.titulo,
            text: armarTexto(entrada, correo),
            html: armarHtml(entrada, correo)
        })
    ));

    const fallidos = resultados.filter((r) => r.status === "rejected");
    fallidos.forEach((r) => console.error("Error enviando correo: " + r.reason.message));

    return { enviados: resultados.length - fallidos.length, fallidos: fallidos.length, configurado: true };
}

module.exports = {
    notificarSuscriptores,
    enviarConfirmacion,
    tokenBaja
};
