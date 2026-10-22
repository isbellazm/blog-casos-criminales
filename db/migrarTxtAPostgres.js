require("dotenv").config();

const SuscriptorDAOTxt = require("../dao/SuscriptorDAOTxt");
const SuscriptorDAOPostgres = require("../dao/SuscriptorDAOPostgres");
const Conexion = require("./Conexion");

async function migrar() {
    const txt = new SuscriptorDAOTxt();
    const postgres = new SuscriptorDAOPostgres();
    const suscriptores = await txt.listar();
    let nuevos = 0;

    for (const s of suscriptores) {
        if (!(await postgres.existe(s.correo))) {
            await postgres.guardar(s.correo);
            nuevos++;
        }
    }

    console.log("Correos en el txt: " + suscriptores.length + " | pasados a PostgreSQL: " + nuevos);
    await Conexion.getInstancia().getPool().end();
}

migrar().catch((error) => {
    console.error("No se pudo migrar: " + error.message);
    process.exit(1);
});
