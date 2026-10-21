const fs = require("fs");
const path = require("path");
const { fechaActual } = require("../utils/fechas");

const ARCHIVO = path.join(__dirname, "..", "data", "suscriptores.txt");

// cada linea del txt: fecha | correo
class SuscriptorDAOTxt {

    leerLineas() {
        if (!fs.existsSync(ARCHIVO)) {
            return [];
        }
        return fs.readFileSync(ARCHIVO, "utf8")
            .split("\n")
            .filter((linea) => linea.trim() !== "");
    }

    async listar() {
        return this.leerLineas().map((linea) => {
            const partes = linea.split(" | ");
            return { fecha: partes[0], correo: partes[1] };
        });
    }

    async existe(correo) {
        const suscriptores = await this.listar();
        return suscriptores.some((s) => s.correo === correo);
    }

    async guardar(correo) {
        fs.mkdirSync(path.dirname(ARCHIVO), { recursive: true });
        fs.appendFileSync(ARCHIVO, fechaActual() + " | " + correo + "\n", "utf8");
        return true;
    }

    async eliminar(correo) {
        const lineas = this.leerLineas();
        const restantes = lineas.filter((linea) => linea.split(" | ")[1] !== correo);
        if (restantes.length === lineas.length) {
            return false;
        }
        fs.writeFileSync(ARCHIVO, restantes.map((l) => l + "\n").join(""), "utf8");
        return true;
    }
}

module.exports = SuscriptorDAOTxt;
