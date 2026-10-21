const fs = require("fs");
const path = require("path");
const { fechaActual } = require("../utils/fechas");

const ARCHIVO = path.join(__dirname, "..", "data", "entradas.txt");

// cada linea del txt: fecha | titulo | resumen | enlace
class EntradaDAOTxt {

    limpiar(texto) {
        return (texto || "").replace(/\|/g, "/").replace(/\s*\n\s*/g, " ").trim();
    }

    async listar() {
        if (!fs.existsSync(ARCHIVO)) {
            return [];
        }
        return fs.readFileSync(ARCHIVO, "utf8")
            .split("\n")
            .filter((linea) => linea.trim() !== "")
            .map((linea) => {
                const partes = linea.split(" | ");
                return { fecha: partes[0], titulo: partes[1], resumen: partes[2], enlace: partes[3] || "" };
            });
    }

    async guardar(entrada) {
        const fecha = fechaActual();
        const linea = [fecha, this.limpiar(entrada.titulo), this.limpiar(entrada.resumen), this.limpiar(entrada.enlace)]
            .join(" | ");
        fs.mkdirSync(path.dirname(ARCHIVO), { recursive: true });
        fs.appendFileSync(ARCHIVO, linea + "\n", "utf8");
        return { ...entrada, fecha };
    }
}

module.exports = EntradaDAOTxt;
