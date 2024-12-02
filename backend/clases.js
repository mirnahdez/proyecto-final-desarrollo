class usuario {

    constructor(id_usuario_creacion_usuario, nombre_usuario, contrasenia_usuario, fecha_creacion_usuario, id_estado_usuario) {
        this.id_usuario_creacion_usuario = id_usuario_creacion_usuario;
        this.nombre_usuario = nombre_usuario;
        this.contrasenia_usuario = contrasenia_usuario;
        this.fecha_creacion_usuario = fecha_creacion_usuario;
        this.id_estado_usuario = id_estado_usuario;
    }

}

class usuario_lectura {

    constructor(id_usuario, id_usuario_creacion_usuario, nombre_usuario, contrasenia_usuario, fecha_creacion_usuario, id_estado_usuario) {
        this.id_usuario = id_usuario;
        this.id_usuario_creacion_usuario = id_usuario_creacion_usuario;
        this.nombre_usuario = nombre_usuario;
        this.contrasenia_usuario = contrasenia_usuario;
        this.fecha_creacion_usuario = fecha_creacion_usuario;
        this.id_estado_usuario = id_estado_usuario;
    }

}

class proyecto {

    constructor(nombre_proyecto, descripcion_proyecto, id_usuario_creacion_proyecto, id_lenguaje_proyecto, version_lenguaje, fecha_creacion_proyecto, fecha_finalizacion_proyecto, id_estado_proyecto) {
        this.nombre_proyecto = nombre_proyecto;
        this.descripcion_proyecto = descripcion_proyecto;
        this.id_usuario_creacion_proyecto = id_usuario_creacion_proyecto;
        this.id_lenguaje_proyecto = id_lenguaje_proyecto;
        this.version_lenguaje = version_lenguaje;
        this.fecha_creacion_proyecto = fecha_creacion_proyecto;
        this.fecha_finalizacion_proyecto = fecha_finalizacion_proyecto;
        this.id_estado_proyecto = id_estado_proyecto;
    }
}


class proyecto_lectura {

    constructor(id_proyecto, nombre_proyecto, descripcion_proyecto, id_usuario_creacion_proyecto, id_lenguaje_proyecto, version_lenguaje, fecha_creacion_proyecto, fecha_finalizacion_proyecto, id_estado_proyecto) {
        this.id_proyecto = id_proyecto;
        this.nombre_proyecto = nombre_proyecto;
        this.descripcion_proyecto = descripcion_proyecto;
        this.id_usuario_creacion_proyecto = id_usuario_creacion_proyecto;
        this.id_lenguaje_proyecto = id_lenguaje_proyecto;
        this.version_lenguaje = version_lenguaje;
        this.fecha_creacion_proyecto = fecha_creacion_proyecto;
        this.fecha_finalizacion_proyecto = fecha_finalizacion_proyecto;
        this.id_estado_proyecto = id_estado_proyecto;
    }
}

class lenguaje_lectura {

    constructor(id_lenguaje, nombre_lenguaje, descripcion_lenguaje, tipo_aplicacion, id_usuario_creacion_lenguaje, fecha_creacion_lenguaje) {
        this.id_lenguaje = id_lenguaje;
        this.nombre_lenguaje = nombre_lenguaje;
        this.descripcion_lenguaje = descripcion_lenguaje;
        this.tipo_aplicacion = tipo_aplicacion;
        this.id_usuario_creacion_lenguaje = id_usuario_creacion_lenguaje;
        this.fecha_creacion_lenguaje = fecha_creacion_lenguaje;
    }

}

class carpeta {

    constructor(id_proyecto_asociado, nombre_carpeta, descripcion_carpeta, id_usuario_creacion_carpeta, fecha_creacion_carpeta, id_carpeta_asociada, nivel_carpeta) {
        this.id_proyecto_asociado = id_proyecto_asociado;
        this.nombre_carpeta = nombre_carpeta;
        this.descripcion_carpeta = descripcion_carpeta;
        this.id_usuario_creacion_carpeta = id_usuario_creacion_carpeta;
        this.fecha_creacion_carpeta = fecha_creacion_carpeta;
        this.id_carpeta_asociada = id_carpeta_asociada;
        this.nivel_carpeta = nivel_carpeta;
    }

}

class carpeta_lectura {

    constructor(id_carpeta, id_proyecto_asociado, nombre_carpeta, descripcion_carpeta, id_usuario_creacion_carpeta, fecha_creacion_carpeta, id_carpeta_asociada, nivel_carpeta) {
        this.id_carpeta = id_carpeta;
        this.id_proyecto_asociado = id_proyecto_asociado;
        this.nombre_carpeta = nombre_carpeta;
        this.descripcion_carpeta = descripcion_carpeta;
        this.id_usuario_creacion_carpeta = id_usuario_creacion_carpeta;
        this.fecha_creacion_carpeta = fecha_creacion_carpeta;
        this.id_carpeta_asociada = id_carpeta_asociada;
        this.nivel_carpeta = nivel_carpeta;
    }

}

class estado {

    constructor(idEstado, nombreEstado, descripcionEstado, tipoEstado) {
        this.idEstado = idEstado;
        this.nombreEstado = nombreEstado;
        this.descripcionEstado = descripcionEstado;
        this.tipoEstado = tipoEstado;
    }

}

class bitacora {

    constructor(idBitacora, idUsuarioAsociado, idProyectoAsociado, idCarpetaAsociada, tipoAccion, nombreAccion, descripcionAccion) {
        this.idBitacora = idBitacora;
        this.idUsuarioAsociado = idUsuarioAsociado;
        this.idProyectoAsociado = idProyectoAsociado;
        this.idCarpetaAsociada = idCarpetaAsociada;
        this.tipoAccion = tipoAccion;
        this.nombreAccion = nombreAccion;
        this.descripcionAccion = descripcionAccion;
    }

}

class archivo {

    constructor(id_usuario_creacion_archivo, id_carpeta_asociada, id_proyecto_asociado, nombre_archivo, extension_archivo, peso_archivo, tipo_archivo, fecha_creacion_archivo, url_archivo) {
        this.id_usuario_creacion_archivo = id_usuario_creacion_archivo;
        this.id_carpeta_asociada = id_carpeta_asociada;
        this.id_proyecto_asociado = id_proyecto_asociado;
        this.nombre_archivo = nombre_archivo;
        this.extension_archivo = extension_archivo;
        this.peso_archivo = peso_archivo;
        this.tipo_archivo = tipo_archivo;
        this.fecha_creacion_archivo = fecha_creacion_archivo;
        this.url_archivo = url_archivo;
    }

}

class archivo_lectura {

    constructor(id_archivo, id_usuario_creacion_archivo, id_carpeta_asociada, id_proyecto_asociado, nombre_archivo, extension_archivo, peso_archivo, tipo_archivo, fecha_creacion_archivo, url_archivo) {
        this.id_archivo = id_archivo;
        this.id_usuario_creacion_archivo = id_usuario_creacion_archivo;
        this.id_carpeta_asociada = id_carpeta_asociada;
        this.id_proyecto_asociado = id_proyecto_asociado;
        this.nombre_archivo = nombre_archivo;
        this.extension_archivo = extension_archivo;
        this.peso_archivo = peso_archivo;
        this.tipo_archivo = tipo_archivo;
        this.fecha_creacion_archivo = fecha_creacion_archivo;
        this.url_archivo = url_archivo;
    }

}


class asignacion_lectura {

    constructor(id_asignacion, id_usuario_creacion_asignacion, id_usuario_asignado, id_proyecto_asociado, id_carpeta_asociada, id_rol_asignado, fecha_asignacion, estado_asignacion) {
        this.id_asignacion = id_asignacion;
        this.id_usuario_creacion_asignacion = id_usuario_creacion_asignacion;
        this.id_usuario_asignado = id_usuario_asignado;
        this.id_proyecto_asociado = id_proyecto_asociado;
        this.fecha_asignacion = fecha_asignacion;
        this.id_rol_asignado = id_rol_asignado;
        this.id_carpeta_asociada = id_carpeta_asociada;
        this.estado_asignacion = estado_asignacion;
    }

}

class asignacion {

    constructor(id_usuario_creacion_asignacion, id_usuario_asignado, id_proyecto_asociado, id_carpeta_asociada, id_rol_asignado, fecha_asignacion, estado_asignacion) {
        this.id_usuario_creacion_asignacion = id_usuario_creacion_asignacion;
        this.id_usuario_asignado = id_usuario_asignado;
        this.id_proyecto_asociado = id_proyecto_asociado;
        this.id_carpeta_asociada = id_carpeta_asociada;
        this.id_rol_asignado = id_rol_asignado;
        this.fecha_asignacion = fecha_asignacion;
        this.estado_asignacion = estado_asignacion;
    }

}

module.exports = { asignacion, asignacion_lectura, proyecto, proyecto_lectura, carpeta, carpeta_lectura, usuario, usuario_lectura, archivo, archivo_lectura, lenguaje_lectura};