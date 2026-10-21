function fechaActual() {
    const ahora = new Date();
    const dos = (n) => String(n).padStart(2, "0");
    return ahora.getFullYear() + "-" + dos(ahora.getMonth() + 1) + "-" + dos(ahora.getDate())
        + " " + dos(ahora.getHours()) + ":" + dos(ahora.getMinutes());
}

module.exports = { fechaActual };
