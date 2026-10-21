const Conexion = require("../db/Conexion");

class EntradaDAOPostgres {

    pool() {
        return Conexion.getInstancia().getPool();
    }

    async listar() {
        const resultado = await this.pool().query(
            "select titulo, resumen, enlace, to_char(fecha_publicacion, 'YYYY-MM-DD HH24:MI') as fecha "
            + "from entrada order by fecha_publicacion desc"
        );
        return resultado.rows;
    }

    async guardar(entrada) {
        const resultado = await this.pool().query(
            "insert into entrada (titulo, resumen, enlace) values ($1, $2, $3) "
            + "returning to_char(fecha_publicacion, 'YYYY-MM-DD HH24:MI') as fecha",
            [entrada.titulo, entrada.resumen, entrada.enlace || ""]
        );
        return { ...entrada, fecha: resultado.rows[0].fecha };
    }
}

module.exports = EntradaDAOPostgres;
