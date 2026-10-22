function esTextoValido(valor) {
    return typeof valor === "string" && valor.trim() !== "";
}

function esCorreoValido(correo) {
    if (!esTextoValido(correo)) {
        return false;
    }
    return /^[^\s@|]+@[^\s@|]+\.[^\s@|]+$/.test(correo.trim());
}

function normalizarCorreo(correo) {
    return correo.trim().toLowerCase();
}

module.exports = {
    esTextoValido,
    esCorreoValido,
    normalizarCorreo
};
