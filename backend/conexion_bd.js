const mysqlx = require('@mysql/xdevapi');
// const config = { port: 33060, nombre_bd: 'bd_proyecto', user: 'root', password: 'umg2024', tabla: 'proyecto', host: 'localhost' };
const config = { port: 33060, nombre_bd: 'bd_proyecto', user: 'root', password: 'Pr0y3ct0D3s4rr0ll0.', tabla: 'proyecto', host: 'localhost' };

const { develve_tipo_objeto } = require('./varios');

/**
 * Inserta un registro en la base de datos.
 * @param {string} nombre_tabla Nombre de la tabla en la que se insertará el registro.
 * @param {object} objeto Objeto que se insertará en la tabla (debe contener las mismas columnas y tipos que la tabla).
 * @returns 
 */
function insertar_bd(nombre_tabla, objeto) {

    //creamos una sesion con el usuario y contraseña definidos
    return mysqlx.getSession({ user: config.user, password: config.password, host: config.host, port: config.port })

        //establecemos conexión con la base de datos
        .then(conexion_bd => {
            const bd = conexion_bd.getSchema(config.nombre_bd);

            return bd.existsInDatabase()

                //si la base de datos existe, la retornamos, de lo contrario, la creamos
                .then(exists => {
                    if (exists) {
                        return bd;
                    }

                    return conexion_bd.createSchema(config.nombre_bd);
                })

                //obtenemos la tabla enviada como parámetro
                .then(bd => {
                    return bd.getCollectionAsTable(nombre_tabla);
                })

                //insertamos el objeto enviado en la tabla definida
                .then(tabla => {
                    return tabla.insert(objeto).execute();
                })

                //cerramos la sesión y devolvemos la cantidad de registros insertados, que debiera ser 1 siempre.
                .then((resultado) => {
                    // return conexion_bd.close();
                    conexion_bd.close();
                    return resultado.getAffectedItemsCount();
                })

                //en caso haya un error, lo imprimimos en consola y retornamos 0
                .catch(error => {
                    console.log(error);
                    // console.log(error.info.code);
                    // console.log(error.info.msg);
                    return 0;
                });
        });
}

function actualizar_bd(nombre_tabla, arreglo, condicion) {

    //creamos una sesion con el usuario y contraseña definidos
    return mysqlx.getSession({ user: config.user, password: config.password, host: config.host, port: config.port })

        //establecemos conexión con la base de datos
        .then(conexion_bd => {
            const bd = conexion_bd.getSchema(config.nombre_bd);

            return bd.existsInDatabase()

                //si la base de datos existe, la retornamos, de lo contrario, la creamos
                .then(exists => {
                    if (exists) {
                        return bd;
                    }

                    return conexion_bd.createSchema(config.nombre_bd);
                })

                //obtenemos la tabla enviada como parámetro
                .then(bd => {
                    return bd.getCollectionAsTable(nombre_tabla);
                })

                //actualizamos los campos enviados en la tabla definida
                .then(tabla => {

                    let query_actualizacion = tabla.update();
                    query_actualizacion.where(condicion);

                    //actualizamos cada campo del arreglo compartido
                    arreglo.forEach(campo_actualizado => {
                        query_actualizacion.set(campo_actualizado.campo, campo_actualizado.valor);
                    });

                    return query_actualizacion.execute();
                })

                //cerramos la sesión y devolvemos la cantidad de registros actualizados, que debiera ser 1 siempre.
                .then((resultado) => {

                    conexion_bd.close();
                    return resultado.getAffectedItemsCount();
                })

                //en caso haya un error, lo imprimimos en consola y retornamos 0
                .catch(error => {
                    console.log(error);
                    // console.log(error.info.code);
                    // console.log(error.info.msg);
                    return 0;
                });
        });
}


/**
 * Lee los registros de la tabla indicada y devuelve un arreglo de objetos.
 * @param {string} nombre_tabla Nombre de la tabla de la que se obtendrá la información.
 * @param {string} tipo_objeto Tipo de arreglo de objetos que debe retornar la función.
 * @param {string} filtro_registros Opcional, una sentencia que filtra la información devuelta por la base de datos.
 * @returns 
 */
function leer_registros(nombre_tabla, tipo_objeto, filtro_registros) {

    //creamos una sesion con el usuario y contraseña definidos
    return mysqlx.getSession({ user: config.user, password: config.password, host: config.host, port: config.port })

        //establecemos conexión con la base de datos
        .then(sesion => {
            const bd = sesion.getSchema(config.nombre_bd);

            //si la base de datos existe, la retornamos, de lo contrario, la creamos
            return bd.existsInDatabase()
                .then(exists => {
                    if (exists) {
                        return bd;
                    }

                    return sesion.createSchema(config.nombre_bd);
                })

                //obtenemos la tabla enviada como parámetro
                .then(bd => {
                    return bd.getCollectionAsTable(nombre_tabla);
                })

                //leemos los registros de la tabla, si el parametro filtro_registros tiene informacion, los filtramos, de lo contrario devolvemos todos los registros
                .then(tabla => {

                    return filtro_registros ? tabla.select().where(filtro_registros).execute() : tabla.select().execute();
                })

                //obtenemos todos los registros devueltos y los convertimos al objeto indicado como parametro
                .then(resultado => {

                    let registros = resultado.fetchAll();
                    let objetos = [];
                    let objeto_actual = {};
                    let longitud_objeto = registros.length > 0 ? registros[0].length : 0;

                    //por cada registro, creamos un objeto del tipo indicado según la informacion devuelta por la base de datos
                    registros.forEach(registro => {

                        objeto_actual = develve_tipo_objeto(
                            tipo_objeto,
                            registro[longitud_objeto >= 0 ? 0 : longitud_objeto - 1],
                            registro[longitud_objeto >= 1 ? 1 : longitud_objeto - 1],
                            registro[longitud_objeto >= 2 ? 2 : longitud_objeto - 1],
                            registro[longitud_objeto >= 3 ? 3 : longitud_objeto - 1],
                            registro[longitud_objeto >= 4 ? 4 : longitud_objeto - 1],
                            registro[longitud_objeto >= 5 ? 5 : longitud_objeto - 1],
                            registro[longitud_objeto >= 6 ? 6 : longitud_objeto - 1],
                            registro[longitud_objeto >= 7 ? 7 : longitud_objeto - 1],
                            registro[longitud_objeto >= 8 ? 8 : longitud_objeto - 1],
                            registro[longitud_objeto >= 9 ? 9 : longitud_objeto - 1]
                        );

                        //agregamos los registros al arreglo de objetos
                        objetos.push(objeto_actual);
                    });

                    //devolvemos los registros
                    // console.log(registros);
                    // return registros;
                    return objetos;
                })

                //cerramos la sesion y devolvemos el arreglo de objetos
                .then((objetos) => {

                    // console.log(registros);
                    sesion.close();
                    return objetos;
                    // return session.close();
                })

                // //cerramos la sesion y devolvemos el arreglo de objetos
                // .then((registros) => {

                //     // console.log(registros);
                //     sesion.close();
                //     return registros;
                //     // return session.close();
                // })

                //en caso haya un error, lo imprimimos en consola y devolvemos nulo
                .catch(error => {
                    console.log(error)
                    // console.log(error.info.code);
                    // console.log(error.info.msg);
                    return null;
                });
        });

}

function leer_registros_query(query, tipo_objeto) {

    //creamos una sesion con el usuario y contraseña definidos
    return mysqlx.getSession({ user: config.user, password: config.password, host: config.host, port: config.port })

        //establecemos conexión con la base de datos
        .then(sesion => {
            const bd = sesion.getSchema(config.nombre_bd);

            //si la base de datos existe, la retornamos, de lo contrario, la creamos
            return bd.existsInDatabase()
                .then(exists => {
                    if (exists) {
                        return sesion;
                    }

                    sesion.createSchema(config.nombre_bd);
                    return sesion;
                })

                //ejecutamos el query enviado como parámetro
                .then(sesion => {

                    return sesion.sql(query).execute();
                })

                //obtenemos todos los registros devueltos y los convertimos al objeto indicado como parametro
                .then(resultado => {

                    let registros = resultado.fetchAll();
                    let objetos = [];
                    let objeto_actual = {};
                    let longitud_objeto = registros.length > 0 ? registros[0].length : 0;

                    //por cada registro, creamos un objeto del tipo indicado según la informacion devuelta por la base de datos
                    registros.forEach(registro => {

                        objeto_actual = develve_tipo_objeto(
                            tipo_objeto,
                            registro[longitud_objeto >= 0 ? 0 : longitud_objeto - 1],
                            registro[longitud_objeto >= 1 ? 1 : longitud_objeto - 1],
                            registro[longitud_objeto >= 2 ? 2 : longitud_objeto - 1],
                            registro[longitud_objeto >= 3 ? 3 : longitud_objeto - 1],
                            registro[longitud_objeto >= 4 ? 4 : longitud_objeto - 1],
                            registro[longitud_objeto >= 5 ? 5 : longitud_objeto - 1],
                            registro[longitud_objeto >= 6 ? 6 : longitud_objeto - 1],
                            registro[longitud_objeto >= 7 ? 7 : longitud_objeto - 1],
                            registro[longitud_objeto >= 8 ? 8 : longitud_objeto - 1],
                            registro[longitud_objeto >= 9 ? 9 : longitud_objeto - 1]
                        );

                        //agregamos los registros al arreglo de objetos
                        objetos.push(objeto_actual);
                    });

                    //devolvemos los registros
                    // console.log(registros);
                    // return registros;
                    return objetos;
                })

                //cerramos la sesion y devolvemos el arreglo de objetos
                .then((objetos) => {

                    // console.log(registros);
                    sesion.close();
                    return objetos;
                    // return session.close();
                })

                //en caso haya un error, lo imprimimos en consola y devolvemos nulo
                .catch(error => {
                    console.log(error)
                    // console.log(error.info.code);
                    // console.log(error.info.msg);
                    return null;
                });
        });

}

// leer_registros('proyecto', 'proyecto_lectura');

// async function prueba (){
//     let prueba = await leer_registros('proyecto', 'proyecto_lectura');
//     console.log(prueba);
// }
// // console.log(leer_registros('proyecto', 'proyecto_lectura'));

// prueba();




module.exports = { insertar_bd, leer_registros, leer_registros_query, actualizar_bd }