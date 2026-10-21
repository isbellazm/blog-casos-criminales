const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const ARCHIVO_PROPIEDADES = path.join(__dirname, "..", "config", "db.properties");

// singleton, igual que la clase Conexion del proyecto de poo
class Conexion {

    static instancia = null;

    constructor() {
        const config = this.cargarConfiguracion();
        const direccion = new URL(config.url);
        this.pool = new Pool({
            host: direccion.hostname,
            port: Number(direccion.port) || 5432,
            database: direccion.pathname.slice(1),
            user: config.usuario,
            password: String(config.clave)
        });
        console.log("Conexion configurada con PostgreSQL: " + config.url);
    }

    cargarConfiguracion() {
        const props = {};
        try {
            const contenido = fs.readFileSync(ARCHIVO_PROPIEDADES, "utf8");
            contenido.split("\n").forEach((linea) => {
                const limpia = linea.trim();
                if (limpia === "" || limpia.startsWith("#")) {
                    return;
                }
                const igual = limpia.indexOf("=");
                props[limpia.slice(0, igual).trim()] = limpia.slice(igual + 1).trim();
            });
        } catch (error) {
            console.error("No se encontro db.properties, usando valores por defecto.");
        }
        return {
            url: props["db.url"] || "postgresql://localhost:5432/casos_criminales",
            usuario: props["db.user"] || "postgres",
            clave: props["db.password"] || "12345678"
        };
    }

    static getInstancia() {
        if (Conexion.instancia === null) {
            Conexion.instancia = new Conexion();
        }
        return Conexion.instancia;
    }

    getPool() {
        return this.pool;
    }
}

module.exports = Conexion;
