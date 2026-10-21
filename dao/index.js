const SuscriptorDAOTxt = require("./SuscriptorDAOTxt");
const EntradaDAOTxt = require("./EntradaDAOTxt");

// por defecto usa postgres, solo guarda en txt si el .env dice ALMACENAMIENTO=txt
function crearDAOs() {
    if (process.env.ALMACENAMIENTO !== "txt") {
        const SuscriptorDAOPostgres = require("./SuscriptorDAOPostgres");
        const EntradaDAOPostgres = require("./EntradaDAOPostgres");
        return {
            suscriptorDAO: new SuscriptorDAOPostgres(),
            entradaDAO: new EntradaDAOPostgres()
        };
    }
    return {
        suscriptorDAO: new SuscriptorDAOTxt(),
        entradaDAO: new EntradaDAOTxt()
    };
}

module.exports = crearDAOs();
