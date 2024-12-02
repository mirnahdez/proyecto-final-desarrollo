const { proyecto_lectura, carpeta_lectura, usuario_lectura, archivo_lectura, lenguaje_lectura, asignacion_lectura } = require('./clases');
let jwt = require('jsonwebtoken');
let llave_privada = 'Pr0y3ct0S3min@ri0.@r3@D3s@rr0ll0';

// const {leer_registros} = require('./conexion_bd');

/**
 * Devuelve un objeto del tipo indicado.
 * @param {string} tipo_objeto Define el tipo de objeto que devolverá la función
 * @param {*} parametro_1 
 * @param {*} parametro_2 
 * @param {*} parametro_3 
 * @param {*} parametro_4 
 * @param {*} parametro_5 
 * @param {*} parametro_6 
 * @param {*} parametro_7 
 * @param {*} parametro_8 
 * @param {*} parametro_9 
 * @param {*} parametro_10 
 */
function develve_tipo_objeto(tipo_objeto, parametro_1, parametro_2, parametro_3, parametro_4, parametro_5, parametro_6, parametro_7, parametro_8, parametro_9, parametro_10) {

    switch (tipo_objeto) {
        case 'proyecto_lectura':
            return new proyecto_lectura(parametro_1, parametro_2, parametro_3, parametro_4, parametro_5, parametro_6, parametro_7, parametro_8, parametro_9);
        case 'carpeta_lectura':
            return new carpeta_lectura(parametro_1, parametro_2, parametro_3, parametro_4, parametro_5, parametro_6, parametro_7, parametro_8);
        case 'usuario_lectura':
            return new usuario_lectura(parametro_1, parametro_2, parametro_3, parametro_4, parametro_5, parametro_6);
        case 'archivo_lectura':
            return new archivo_lectura(parametro_1, parametro_2, parametro_3, parametro_4, parametro_5, parametro_6, parametro_7, parametro_8, parametro_9, parametro_10);
        case 'lenguaje_lectura':
            return new lenguaje_lectura(parametro_1, parametro_2, parametro_3, parametro_4, parametro_5, parametro_6);
        case 'asignacion_lectura':
            return new asignacion_lectura(parametro_1, parametro_2, parametro_3, parametro_4, parametro_5, parametro_6, parametro_7, parametro_8);

        default:
            break;
    }
}

/**
 * Valida el objeto enviado desde el cliente previo a ingresarlo en la base de datos (proyecto, carpeta, usuario, entre otros)
 * @param {string} tipo_objeto Tipo de objeto que se evaluará
 * @param {object} objeto Objeto que se evaluará
 * @returns boolean
 */
function validacion_entrada(tipo_objeto, objeto) {

    let resultado_validacion = false;

    switch (tipo_objeto) {
        case 'proyecto':
            resultado_validacion = valida_proyecto(objeto.nombre_proyecto, objeto.descripcion_proyecto, objeto.id_usuario_creacion_proyecto, objeto.id_lenguaje_proyecto, objeto.fecha_creacion_proyecto, objeto.fecha_finalizacion_proyecto, objeto.id_estado_proyecto);
            break;

        case 'carpeta':
            resultado_validacion = valida_carpeta(objeto.id_proyecto_asociado, objeto.nombre_carpeta, objeto.descripcion_carpeta, objeto.id_usuario_creacion_carpeta, objeto.fecha_creacion_carpeta, objeto.id_carpeta_asociada, objeto.nivel_carpeta);
            break;

        case 'usuario':
            resultado_validacion = valida_usuario(objeto.id_usuario_creacion_usuario, objeto.nombre_usuario, objeto.fecha_creacion_usuario, objeto.id_estado_usuario);
            break;

        case 'archivo':
            resultado_validacion = valida_archivo(objeto.id_usuario_creacion_archivo, objeto.id_carpeta_asociada, objeto.id_proyecto_asociado, objeto.nombre_archivo, objeto.extension_archivo, objeto.peso_archivo, objeto.tipo_archivo, objeto.fecha_creacion_archivo);
            break;

        case 'asignacion':
            resultado_validacion = valida_asignacion(objeto.id_asignacion, objeto.id_usuario_creacion_asignacion, objeto.id_usuario_asignado, objeto.id_proyecto_asociado, objeto.id_carpeta_asociada, objeto.id_rol_asignado, objeto.fecha_asignacion, objeto.estado_asignacion);
            break;
    }

    return resultado_validacion;
}

/**
 * Realiza todas las validaciones previo a insertar un nuevo proyecto en la base de datos.
 * @param {string} nombre_proyecto Nombre del proyecto
 * @param {string} descripcion_proyecto Descripcion del proyecto
 * @param {int} id_usuario_creacion_proyecto Id del usuario que creó el proyecto
 * @param {int} id_lenguaje_proyecto Id del lenguaje sobre el cual se desarrollará el proyecto
 * @param {string} fecha_creacion_proyecto Fecha de creación del proyecto
 * @param {string} fecha_finalizacion_proyecto Fecha de finalización del proyecto
 * @param {int} id_estado_proyecto Id del estado en que se encuentra el proyecto
 * @returns boolean
 */
function valida_proyecto(nombre_proyecto, descripcion_proyecto, id_usuario_creacion_proyecto, id_lenguaje_proyecto, fecha_creacion_proyecto, fecha_finalizacion_proyecto, id_estado_proyecto) {

    //se valida que el nombre y descripción no tengan caracteres especiales, que los id sean números y que las fechas tengan el formato correcto
    if (valida_nombre_archivo(nombre_proyecto)
        && valida_nombre_archivo(descripcion_proyecto)
        && es_numero(id_usuario_creacion_proyecto)
        && es_numero(id_lenguaje_proyecto)
        && es_numero(id_estado_proyecto)
        && valida_fecha(fecha_creacion_proyecto)
        && valida_fecha(fecha_finalizacion_proyecto)
    )
        return true;

    return false;
}

/**
 * Valida los datos ingresados desde el cliente, previo a insertar una carpeta en la base de datos.
 * @param {int} id_proyecto_asociado Id del proyecto asociado.
 * @param {string} nombre_carpeta Nombre de la carpeta.
 * @param {string} descripcion_carpeta Descripción de la carpeta.
 * @param {int} id_usuario_creacion_carpeta Id del usuario que creó la carpeta.
 * @param {string} fecha_creacion_carpeta Fecha de creación de la carpeta.
 * @param {int} id_carpeta_asociada Id de la carpeta madre.
 * @param {int} nivel_carpeta Nivel de la carpeta partiendo de 0 cuando es la raíz de proyecto y sumando 1 por cada nivel.
 * @returns 
 */
function valida_carpeta(id_proyecto_asociado, nombre_carpeta, descripcion_carpeta, id_usuario_creacion_carpeta, fecha_creacion_carpeta, id_carpeta_asociada, nivel_carpeta) {

    //se valida que el nombre y descripción no tengan caracteres especiales, que los id sean números y que las fechas tengan el formato correcto
    if (valida_nombre_archivo(nombre_carpeta)
        && valida_nombre_archivo(descripcion_carpeta)
        && es_numero(id_proyecto_asociado)
        && es_numero(id_usuario_creacion_carpeta)
        && es_numero(id_carpeta_asociada)
        && es_numero(nivel_carpeta)
        && valida_fecha(fecha_creacion_carpeta)
    )
        return true;

    return false;
}


function valida_usuario(id_usuario_creacion_usuario, nombre_usuario, fecha_creacion_usuario, id_estado_usuario) {

    //se valida que el nombre de usuario no tenga caracteres especiales, que los id sean números y que las fechas tengan el formato correcto
    if (valida_nombre_archivo(nombre_usuario)
        && es_numero(id_usuario_creacion_usuario)
        && es_numero(id_estado_usuario)
        && valida_fecha(fecha_creacion_usuario)
    )
        return true;

    return false;
}

function valida_archivo(id_usuario_creacion_archivo, id_carpeta_asociada, id_proyecto_asociado, nombre_archivo, extension_archivo, peso_archivo, tipo_archivo, fecha_creacion_archivo) {

    //se valida que el nombre de usuario no tenga caracteres especiales, que los id sean números y que las fechas tengan el formato correcto
    if (valida_nombre_archivo(nombre_archivo)
        && valida_nombre_archivo(extension_archivo)
        && valida_nombre_archivo(peso_archivo)
        && valida_nombre_archivo(tipo_archivo)
        && es_numero(id_usuario_creacion_archivo)
        && es_numero(id_carpeta_asociada)
        && es_numero(id_proyecto_asociado)
        && valida_fecha(fecha_creacion_archivo)
    )
        return true;

    return false;
}

function valida_asignacion(id_asignacion, id_usuario_creacion_asignacion, id_usuario_asignado, id_proyecto_asociado, id_carpeta_asociada, id_rol_asignado, fecha_asignacion, estado_asignacion) {

    //se valida que el nombre de usuario no tenga caracteres especiales, que los id sean números y que las fechas tengan el formato correcto
    if (es_numero(id_asignacion)
        && es_numero(id_usuario_creacion_asignacion)
        && es_numero(id_usuario_asignado)
        && es_numero(id_proyecto_asociado)
        && es_numero(id_carpeta_asociada)
        && es_numero(id_rol_asignado)
        && es_numero(estado_asignacion)
        && valida_fecha(fecha_asignacion)
    )
        return true;

    return false;
}

/**
 * Valida que el texto ingresado no contenga los siguientes caracteres: *, #, %, /, &, ', ", \
 * @param {string} nombre_carpeta El nombre del archivo, carpeta, proyecto o texto que se desea validar.
 * @returns boolean
 */
function valida_nombre_archivo(nombre_carpeta) {
    let str_nombre_carpeta = nombre_carpeta.toString();

    if (str_nombre_carpeta.includes('*'))
        return false;
    if (str_nombre_carpeta.includes('#'))
        return false;
    if (str_nombre_carpeta.includes('%'))
        return false;
    if (str_nombre_carpeta.includes('/'))
        return false
    if (str_nombre_carpeta.includes('&'))
        return false
    if (str_nombre_carpeta.includes(`'`))
        return false
    if (str_nombre_carpeta.includes(`"`))
        return false
    if (str_nombre_carpeta.includes(`\\`))
        return false

    return true;
}

/**
 * Valida que el objeto o texto ingresado sea un número.
 * @param {object} valor Dato a validar.
 * @returns boolean
 */
function es_numero(valor) {

    if (parseInt(valor) >= 0)
        return true;

    return false;
}

/**
 * Valida que la fecha ingresada coincida con el siguiente formato: aaaa-mm-dd hh:mm:ss
 * @param {string} fecha Fecha a evaluar.
 * @returns boolean
 */
function valida_fecha(fecha) {
    let formato_fecha = /^([0-2][0-9][0-9][0-9])(\-)(0[1-9]|1[0-2])(\-)(0[1-9]|1[0-9]|2[0-9]|3[0-1])(\ )(0[0-9]|1[0-9]|2[0-3])(\:)(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])(\:)(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$/;

    if (formato_fecha.test(fecha))
        return true;

    return false;
}

/**
 * Valida si el usuario se encuentra logueado, según token compartido desde el cliente.
 * @param {string} token Token enviado desde el cliente
 * @returns null / usuario
 */
function usuario_logueado(token) {

    try {
        //verificamos el token contra la llave privada y devolvemos el usuario encontrado
        let usuario_logueado_actual = jwt.verify(token, llave_privada);
        return usuario_logueado_actual;

    } catch (error) {
        console.log(error);
        return false;
    }

}

const formatear_fecha = (fecha) => {
    // const fecha = new Date();

    const aaaa = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes (0-11, por eso +1)
    const dd = String(fecha.getDate()).padStart(2, '0');

    const hh = String(fecha.getHours()).padStart(2, '0');
    const min = String(fecha.getMinutes()).padStart(2, '0');
    const ss = String(fecha.getSeconds()).padStart(2, '0');

    return `${aaaa}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

module.exports = { develve_tipo_objeto, validacion_entrada, usuario_logueado, formatear_fecha }