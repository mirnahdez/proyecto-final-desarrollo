const express = require('express');
const router = express.Router();
const { proyecto, asignacion, proyecto_lectura } = require('./clases');
const { insertar_bd, leer_registros, leer_registros_query, actualizar_bd } = require('./conexion_bd');
const { validacion_entrada, usuario_logueado, formatear_fecha } = require('./varios');

router.post('/proyecto/nuevo', async (req, res) => {

    try {

        let usuario_logueado_actual = "";

        if (req.headers.authorization) {
            usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if (!usuario_logueado_actual) {
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
                return;
            }
        }
        else {
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`);
            return;
        }

        //si la solicitud no trae un cuerpo, devolvemos un error
        if (!req.body) {
            res.redirect(`/error/${'¡ERROR! No se pudo crear el proyecto por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);
            return;
        }

        //creamos el objeto tipo proyecto
        let proyecto_nuevo = new proyecto(
            req.body.nombre_proyecto,
            req.body.descripcion_proyecto,
            // req.body.id_usuario_creacion_proyecto,
            usuario_logueado_actual.id_usuario,
            req.body.id_lenguaje_proyecto,
            req.body.version_lenguaje,
            req.body.fecha_creacion_proyecto,
            req.body.fecha_finalizacion_proyecto,
            req.body.id_estado_proyecto
        );

        //validamos la información ingresada
        let entrada_valida = await validacion_entrada('proyecto', proyecto_nuevo);

        //si la información ingresada es válida
        if (entrada_valida) {

            //obtenemos el listado de proyectos con el mismo nombre (creados por el mismo usuario)
            // let proyectos = await leer_registros('proyecto', 'proyecto_lectura', `nombre_proyecto = '${req.body.nombre_proyecto}' and id_usuario_creacion_proyecto = ${req.body.id_usuario_creacion_proyecto}`);
            // let proyectos = await leer_registros('proyecto', 'proyecto_lectura', `nombre_proyecto = '${req.body.nombre_proyecto}' and id_usuario_creacion_proyecto = ${usuario_logueado_actual.id_usuario}`);
            let proyectos = await leer_registros('proyecto', 'proyecto_lectura', `nombre_proyecto = '${req.body.nombre_proyecto}'`);

            //si hay algun proyecto con ese nombre, no es posible crear uno nuevo
            if (proyectos.length > 0)
                res.redirect(`/error/${'¡ERROR! No se pudo crear el proyecto, nombre de proyecto existente. Por favor intenta nuevamente.'}`);
            else {
                //insertamos el nuevo proyecto según la información enviada desde el cliente
                let resultado_insercion = await insertar_bd('proyecto', proyecto_nuevo);

                //si el resultado es correcto, enviamos un mensaje de éxito. De lo contrario un error
                if (resultado_insercion == 1)
                    // res.redirect(`/proyecto/${req.body.nombre_proyecto}`)
                    res.redirect('/info/Proyecto creado con éxito.');
                else
                    res.redirect(`/error/${'¡ERROR! No se pudo crear el proyecto. Por favor intenta nuevamente.'}`);
            }
        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo crear el proyecto, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

// router.get('/proyecto/:nombre_proyecto', async (req, res) => {

//     const { nombre_proyecto } = req.params;

//     //leemos la información de la base de datos para obtener el proyecto, según el nombre ingresado y el usuario que lo creó
//     // IMPORTANTE: Debe validarse la info antes de mandarla directo al script. El usuario debería tomarse según la sesión.

//     let proyectos = await leer_registros('proyecto', 'proyecto_lectura', `nombre_proyecto = '${nombre_proyecto}' and id_usuario_creacion_proyecto = ${1}`)

//     if (proyectos)
//         res.json(proyectos);
//     else
//         res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`);
// })

router.get('/proyecto/listado_proyectos', async (req, res) => {

    //leemos la información de la base de datos para obtener el listado de proyectos según el usuario logueado
    // IMPORTANTE: Debe validarse la info antes de mandarla directo al script. El usuario debería tomarse según la sesión.

    try {

        let usuario_logueado_actual = "";

        if (req.headers.authorization) {
            usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if (!usuario_logueado_actual) {
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
                return;
            }

            let query_bd =
                `   select p.* from bd_proyecto.asignacion a
                    join bd_proyecto.proyecto p
                    where a.id_usuario_asignado = ${usuario_logueado_actual.id_usuario} 
                    and a.id_usuario_creacion_asignacion != ${usuario_logueado_actual.id_usuario} 
                    and a.id_proyecto_asociado = p.id_proyecto;
            `;

            let proyectos_creados = await leer_registros('proyecto', 'proyecto_lectura', `id_usuario_creacion_proyecto = ${usuario_logueado_actual.id_usuario}`);
            let proyectos_asignados = await leer_registros_query(query_bd, 'proyecto_lectura');
            let proyectos_creados_y_asignados = [];

            //declaramos variable contador 
            let contador = 0;

            //creamos la variable que valida si hay archivos y carpetas
            let hay_proyectos_creados = proyectos_creados.length > 0 ? true : false;
            let hay_proyectos_asignados = proyectos_asignados.length > 0 ? true : false;

            //si hay proyectos_creados y proyectos_asignados recorremos cada tipo de arreglo y lo guardamos en el arreglo de proyectos_creados y proyectos_asignados
            if (hay_proyectos_creados && hay_proyectos_asignados) {

                proyectos_creados.forEach(proyecto_creado => {

                    proyectos_creados_y_asignados.push(proyecto_creado);

                    contador++;

                    if (contador == proyectos_creados.length) {

                        contador = 0;

                        proyectos_asignados.forEach(proyecto_asignado => {

                            proyectos_creados_y_asignados.push(proyecto_asignado);

                            contador++;

                            if (contador == proyectos_asignados.length)
                                res.json(proyectos_creados_y_asignados);

                        });
                    }
                });
            }
            //de lo contrario, si hay proyectos_creados, recorremos el arreglo de estos y los guardamos en el arreglo general de proyectos_creados y proyectos_asignados
            else if (hay_proyectos_creados) {

                proyectos_creados.forEach(proyecto_creado => {

                    proyectos_creados_y_asignados.push(proyecto_creado);

                    contador++;

                    if (contador == proyectos_creados.length)
                        res.json(proyectos_creados_y_asignados);

                });
            }
            //de lo contrario, si hay proyectos_asignados, recorremos el arreglo de estas y las guardamos en el arreglo general de archivos y proyectos_asignados
            else if (hay_proyectos_asignados) {

                proyectos_asignados.forEach(proyecto_asignado => {

                    proyectos_creados_y_asignados.push(proyecto_asignado);

                    contador++;

                    if (contador == proyectos_asignados.length)
                        res.json(proyectos_creados_y_asignados);
                });
            }
            //de lo contrario, enviamos un arreglo vacío
            else
                res.json([]);

            // if (proyectos)
            //     res.json(proyectos);
            // else
            //     res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`);

        }
        else {
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`);
            return;
        }


    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

router.get('/proyecto/informacion_proyecto/:id_proyecto', async (req, res) => {

    //leemos la información de la base de datos para obtener el listado de proyectos según el usuario logueado
    // IMPORTANTE: Debe validarse la info antes de mandarla directo al script. El usuario debería tomarse según la sesión.

    try {

        let usuario_logueado_actual = "";

        if (req.headers.authorization) {
            usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if (!usuario_logueado_actual) {
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
                return;
            }

            let proyecto_buscado = await leer_registros('proyecto', 'proyecto_lectura', `id_proyecto = ${req.params.id_proyecto}`);

            if (proyecto_buscado.length > 0) {

                if (proyecto_buscado[0].id_usuario_creacion_proyecto == usuario_logueado_actual.id_usuario)
                    res.json(proyecto_buscado[0])
                else {
                    let asignaciones = await leer_registros('asignacion', 'asignacion_lectura', `id_usuario_asignado = ${usuario_logueado_actual.id_usuario}`);
                    // let asignaciones = await leer_registros('asignacion', 'asignacion_lectura', `id_usuario_asignado = ${usuario_logueado_actual.id_usuario} and id_usuario_creacion_asignacion != ${usuario_logueado_actual.id_usuario}`);

                    let contador = 0;

                    if (asignaciones.length > 0) {

                        asignaciones.forEach(asignacion_actual => {

                            if (asignacion_actual.id_proyecto_asociado == proyecto_buscado[0].id_proyecto) {
                                res.json(proyecto_buscado[0])
                                return;
                            }
                            else if (contador == asignaciones.length)
                                res.redirect(`/error/${'¡ERROR! El usuario logueado no tiene acceso a este proyecto. Por favor asigne el proyecto e intente nuevamente.'}`);
                        
                            contador++;

                        });
                    }
                }
            }
            else
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`);
        }
        else {
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`);
            return;
        }

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

router.post('/proyecto/asignar_proyecto', async (req, res) => {

    try {

        let usuario_logueado_actual = "";

        if (req.headers.authorization) {
            usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if (!usuario_logueado_actual) {
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
                return;
            }
        }
        else {
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`);
            return;
        }

        //si la solicitud no trae un cuerpo, devolvemos un error
        if (!req.body) {
            res.redirect(`/error/${'¡ERROR! No se pudo crear la asignación por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);
            return;
        }

        //creamos el objeto tipo proyecto
        let asignacion_nueva = new asignacion(
            usuario_logueado_actual.id_usuario,
            req.body.id_usuario_asignado,
            req.body.id_proyecto_asociado,
            req.body.id_carpeta_asociada,
            req.body.id_rol_asignado,
            req.body.fecha_asignacion,
            req.body.estado_asignacion
        );

        //validamos la información ingresada
        let entrada_valida = await validacion_entrada('asignacion', asignacion_nueva);

        //si la información ingresada es válida
        if (entrada_valida) {

            //insertamos la nueva asignación según la información enviada desde el cliente
            let resultado_insercion = await insertar_bd('asignacion', asignacion_nueva);

            //si el resultado es correcto, enviamos un mensaje de éxito. De lo contrario un error
            if (resultado_insercion == 1)
                // res.redirect(`/proyecto/${req.body.nombre_proyecto}`)
                res.redirect('/info/Asignación creada con éxito.');
            else
                res.redirect(`/error/${'¡ERROR! No se pudo crear la asignación. Por favor intenta nuevamente.'}`);
        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo crear la asignación, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

router.post('/proyecto/actualizar_proyecto', async (req, res) => {

    try {

        let usuario_logueado_actual = "";

        if (req.headers.authorization) {
            usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if (!usuario_logueado_actual) {
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
                return;
            }
        }
        else {
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`);
            return;
        }

        //si la solicitud no trae un cuerpo, devolvemos un error
        if (!req.body) {
            res.redirect(`/error/${'¡ERROR! No se pudo crear el proyecto por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);
            return;
        }

        //creamos arreglo para actualizar la información en la bd
        let campos_actualizar = [];

        //creamos el objeto tipo proyecto
        let proyecto_actualizado = new proyecto_lectura(
            0,
            "Temporal",
            req.body.descripcion_proyecto,
            0,
            req.body.id_lenguaje_proyecto,
            req.body.version_lenguaje,
            "2024-12-01 00:00:00",
            req.body.fecha_finalizacion_proyecto,
            req.body.id_estado_proyecto
        );

        //validamos la información ingresada
        let entrada_valida = await validacion_entrada('proyecto', proyecto_actualizado);

        //si la información ingresada es válida
        if (entrada_valida) {

            //obtenemos el listado de proyectos con el mismo nombre (creados por el mismo usuario)
            // let proyectos = await leer_registros('proyecto', 'proyecto_lectura', `nombre_proyecto = '${req.body.nombre_proyecto}' and id_usuario_creacion_proyecto = ${req.body.id_usuario_creacion_proyecto}`);
            let proyectos = await leer_registros('proyecto', 'proyecto_lectura', `nombre_proyecto = '${req.body.nombre_proyecto}'`);

            //si hay algun proyecto con ese nombre, procedemos a editar los campos permitidos
            if (proyectos.length > 0) {

                //actualizamos la descripción
                campos_actualizar.push({
                    campo: "descripcion_proyecto",
                    valor: proyecto_actualizado.descripcion_proyecto
                });

                //actualizamos el ID del lenguaje
                campos_actualizar.push({
                    campo: "id_lenguaje_proyecto",
                    valor: proyecto_actualizado.id_lenguaje_proyecto
                });

                //actualizamos la versión del lenguaje utilizado
                campos_actualizar.push({
                    campo: "version_lenguaje",
                    valor: proyecto_actualizado.version_lenguaje
                });

                //actualizamos la fecha de finalización del proyecto
                campos_actualizar.push({
                    campo: "fecha_finalizacion_proyecto",
                    valor: proyecto_actualizado.fecha_finalizacion_proyecto
                });

                //actualizamos el estado del proyecto
                campos_actualizar.push({
                    campo: "id_estado_proyecto",
                    valor: proyecto_actualizado.id_estado_proyecto
                });

                //actualizamos el proyecto según la información enviada desde el cliente
                let resultado_actualizacion = await actualizar_bd('proyecto', campos_actualizar, `id_proyecto = ${proyectos[0].id_proyecto}`);

                //si el resultado es correcto, enviamos un mensaje de éxito. De lo contrario un error
                if (resultado_actualizacion == 1){

                    if(req.body.usuarios_asignados.length > 0){
                        req.body.usuarios_asignados.forEach(async usuario_asignado => {

                            let asignacion_actual = new asignacion(usuario_logueado_actual.id_usuario, usuario_asignado, proyectos[0].id_proyecto, 0, 2,formatear_fecha(new Date()), 7)
                            let resultado_insercion = await insertar_bd('asignacion', asignacion_actual);

                            if(resultado_insercion == 1)
                                console.log('Asignación del usuario ' + usuario_asignado + ' efectuada con éxito.')

                        });
                    }

                    res.redirect('/info/Proyecto actualizado con éxito.');
                }
                else
                    res.redirect(`/error/${'¡ERROR! No se pudo actualizar el proyecto en la base de datos. Por favor intenta nuevamente.'}`);
            }
            else
                res.redirect(`/error/${'¡ERROR! No se pudo actualizar el proyecto, no se encontró en la base de datos. Por favor intenta nuevamente.'}`);
        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo actualizar el proyecto, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

module.exports = router;
