const express = require('express');
const router = express.Router();
const multer = require('multer'); // Middleware para manejar archivos
const path = require('path')
const { archivo } = require('./clases');
const { insertar_bd, leer_registros } = require('./conexion_bd');
const { validacion_entrada, usuario_logueado } = require('./varios');

let nombre_archivo_cargado = "";

// Configuración de multer para guardar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/archivos_cargados/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {

        nombre_archivo_cargado = path.basename(file.originalname, path.extname(file.originalname)) + Date.now() + path.extname(file.originalname);
        cb(null, nombre_archivo_cargado); // Evitar nombres duplicados
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf', 'application/pdf'];

        // if (!tiposPermitidos.includes(file.mimetype)) {
        //     return cb(new Error('Tipo de archivo no permitido.'));
        // }

        cb(null, true);
    }
});

router.post('/archivo/cargar_archivo', upload.single('archivo'), async (req, res) => {

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
            res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);
            return;
        }

        // console.log(nombre_archivo_cargado);
        if (!req.file) {
            res.redirect(`/error/${'¡ERROR! No se pudo cargar el archivo en el servidor. Por favor intenta nuevamente.'}`);
            return;
        }

        const url_archivo = path.join('archivo/', nombre_archivo_cargado);

        //creamos el objeto tipo archivo
        let archivo_nuevo = new archivo(
            usuario_logueado_actual.id_usuario,
            req.body.id_carpeta_asociada,
            req.body.id_proyecto_asociado,
            nombre_archivo_cargado,
            req.body.extension_archivo,
            req.body.peso_archivo,
            req.body.tipo_archivo,
            req.body.fecha_creacion_archivo,
            url_archivo
        );

        //validamos la información ingresada
        let entrada_valida = validacion_entrada('archivo', archivo_nuevo);

        //si la información ingresada es válida
        if (entrada_valida) {

            //obtenemos el listado de archivos con el mismo nombre, capeta asociada y extensión
            let archivos = await leer_registros('archivo', 'archivo_lectura', `nombre_archivo = '${req.body.nombre_archivo}' and id_carpeta_asociada = ${req.body.id_carpeta_asociada} and extension_archivo = '${req.body.extension_archivo}'`);

            //si hay algun archivo que coincida, no es posible crear uno nuevo
            if (archivos.length > 0)
                res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo, nombre de archivo existente. Por favor intenta nuevamente.'}`);
            else {
                //insertamos el nuevo archivo según la información enviada desde el cliente
                let resultado_insercion = await insertar_bd('archivo', archivo_nuevo);

                //si el resultado es correcto, enviamos un mensaje de éxito. De lo contrario un error
                if (resultado_insercion == 1)
                    // res.redirect(`/proyecto/${req.body.nombre_proyecto}`)
                    res.redirect('/info/Archivo cargado con éxito.');
                else
                    res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo. Por favor intenta nuevamente.'}`);
            }
        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
});


router.get("/archivo/:nombre", (req, res) => {

    // let usuario_logueado_actual = "";

    // if (req.headers.authorization) {
    //     usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

    //     if (!usuario_logueado_actual) {
    //         res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
    //         return;
    //     }
    // }
    // else {
    //     res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`);
    //     return;
    // }

    const archivo = path.join(__dirname, "archivos_cargados", req.params.nombre);
    res.sendFile(archivo, (err) => {
        if (err) {
            res.status(404).send("Archivo no encontrado");
        }
    });
});


router.post('/archivo/nuevo', async (req, res) => {

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
            res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);
            return;
        }

        //creamos el objeto tipo archivo
        let archivo_nuevo = new archivo(
            usuario_logueado_actual.id_usuario,
            req.body.id_carpeta_asociada,
            req.body.id_proyecto_asociado,
            req.body.nombre_archivo,
            req.body.extension_archivo,
            req.body.peso_archivo,
            req.body.tipo_archivo,
            req.body.fecha_creacion_archivo
        );

        //validamos la información ingresada
        let entrada_valida = validacion_entrada('archivo', archivo_nuevo);

        //si la información ingresada es válida
        if (entrada_valida) {

            //obtenemos el listado de archivos con el mismo nombre, capeta asociada y extensión
            let archivos = await leer_registros('archivo', 'archivo_lectura', `nombre_archivo = '${req.body.nombre_archivo}' and id_carpeta_asociada = ${req.body.id_carpeta_asociada} and extension_archivo = '${req.body.extension_archivo}'`);

            //si hay algun archivo que coincida, no es posible crear uno nuevo
            if (archivos.length > 0)
                res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo, nombre de archivo existente. Por favor intenta nuevamente.'}`);
            else {
                //insertamos el nuevo archivo según la información enviada desde el cliente
                let resultado_insercion = await insertar_bd('archivo', archivo_nuevo);

                //si el resultado es correcto, enviamos un mensaje de éxito. De lo contrario un error
                if (resultado_insercion == 1)
                    // res.redirect(`/proyecto/${req.body.nombre_proyecto}`)
                    res.redirect('/info/Archivo creado con éxito.');
                else
                    res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo. Por favor intenta nuevamente.'}`);
            }
        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo crear el archivo, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

router.get('/archivo/listado_archivos/:id_carpeta_asociada/:id_proyecto_asociado', async (req, res) => {

    try {

        if (req.headers.authorization) {
            let usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if (!usuario_logueado_actual) {
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
                return;
            }
        }
        else {
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`);
            return;
        }

        //obtenemos el listado de archivos y carpetas segun carpeta de referencia
        // let archivos = await leer_registros('archivo', 'archivo_lectura', `id_carpeta_asociada = ${req.params.id_carpeta_asociada}`);
        // let carpetas = await leer_registros('carpeta', 'carpeta_lectura', `id_carpeta_asociada = ${req.params.id_carpeta_asociada}`);
        let archivos = await leer_registros('archivo', 'archivo_lectura', `id_carpeta_asociada = ${req.params.id_carpeta_asociada} and id_proyecto_asociado = ${req.params.id_proyecto_asociado}`);
        let carpetas = await leer_registros('carpeta', 'carpeta_lectura', `id_carpeta_asociada = ${req.params.id_carpeta_asociada} and id_proyecto_asociado = ${req.params.id_proyecto_asociado}`);

        //creamos variable para almacenar los archivos y carpetas que se encuentren
        let archivos_y_carpetas = [];

        //declaramos variable contador y variable para crear los objetos
        let contador = 0;
        let temp = {};

        //creamos la variable que valida si hay archivos y carpetas
        let hay_archivos = archivos.length > 0 ? true : false;
        let hay_carpetas = carpetas.length > 0 ? true : false;

        //si hay archivos y carpetas recorremos cada tipo de arreglo y lo guardamos en el arreglo de archivos y carpetas
        if (hay_archivos && hay_carpetas) {

            archivos.forEach(archivo_temp => {

                temp = {
                    tipo: 'archivo',
                    id: archivo_temp.id_archivo,
                    id_carpeta_asociada: archivo_temp.id_carpeta_asociada,
                    id_proyecto_asociado: archivo_temp.id_proyecto_asociado,
                    nombre: archivo_temp.nombre_archivo,
                    extension_archivo: archivo_temp.extension_archivo,
                    peso_archivo: archivo_temp.peso_archivo,
                    tipo_archivo: archivo_temp.tipo_archivo,
                    id_usuario_creacion: archivo_temp.id_usuario_creacion_archivo,
                    fecha_creacion: archivo_temp.fecha_creacion_archivo,
                    descripcion_carpeta: '',
                    nivel_carpeta: 0,
                    url_archivo: archivo_temp.url_archivo
                };

                archivos_y_carpetas.push(temp);

                contador++;

                if (contador == archivos.length) {

                    contador = 0;

                    carpetas.forEach(carpeta_temp => {

                        temp = {
                            tipo: 'carpeta',
                            id: carpeta_temp.id_carpeta,
                            id_carpeta_asociada: carpeta_temp.id_carpeta_asociada,
                            id_proyecto_asociado: carpeta_temp.id_proyecto_asociado,
                            nombre: carpeta_temp.nombre_carpeta,
                            extension_archivo: "",
                            peso_archivo: "",
                            tipo_archivo: "",
                            id_usuario_creacion: carpeta_temp.id_usuario_creacion_carpeta,
                            fecha_creacion: carpeta_temp.fecha_creacion_carpeta,
                            descripcion_carpeta: carpeta_temp.descripcion_carpeta,
                            nivel_carpeta: carpeta_temp.nivel_carpeta,
                            url_archivo: ''
                        };

                        archivos_y_carpetas.push(temp);

                        contador++;

                        if (contador == carpetas.length)
                            res.json(archivos_y_carpetas);

                    });
                }
            });
        }
        //de lo contrario, si hay archivos, recorremos el arreglo de estos y los guardamos en el arreglo general de archivos y carpetas
        else if (hay_archivos) {

            archivos.forEach(archivo_temp => {

                temp = {
                    tipo: 'archivo',
                    id: archivo_temp.id_archivo,
                    id_carpeta_asociada: archivo_temp.id_carpeta_asociada,
                    id_proyecto_asociado: archivo_temp.id_proyecto_asociado,
                    nombre: archivo_temp.nombre_archivo,
                    extension_archivo: archivo_temp.extension_archivo,
                    peso_archivo: archivo_temp.peso_archivo,
                    tipo_archivo: archivo_temp.tipo_archivo,
                    id_usuario_creacion: archivo_temp.id_usuario_creacion_archivo,
                    fecha_creacion: archivo_temp.fecha_creacion_archivo,
                    descripcion_carpeta: '',
                    nivel_carpeta: 0,
                    url_archivo: archivo_temp.url_archivo
                };

                archivos_y_carpetas.push(temp);

                contador++;

                if (contador == archivos.length)
                    res.json(archivos_y_carpetas);

            });
        }
        //de lo contrario, si hay carpetas, recorremos el arreglo de estas y las guardamos en el arreglo general de archivos y carpetas
        else if (hay_carpetas) {

            carpetas.forEach(carpeta_temp => {

                temp = {
                    tipo: 'carpeta',
                    id: carpeta_temp.id_carpeta,
                    id_carpeta_asociada: carpeta_temp.id_carpeta_asociada,
                    id_proyecto_asociado: carpeta_temp.id_proyecto_asociado,
                    nombre: carpeta_temp.nombre_carpeta,
                    extension_archivo: "",
                    peso_archivo: "",
                    tipo_archivo: "",
                    id_usuario_creacion: carpeta_temp.id_usuario_creacion_carpeta,
                    fecha_creacion: carpeta_temp.fecha_creacion_carpeta,
                    descripcion_carpeta: carpeta_temp.descripcion_carpeta,
                    nivel_carpeta: carpeta_temp.nivel_carpeta,
                    url_archivo: ''
                };

                archivos_y_carpetas.push(temp);

                contador++;

                if (contador == carpetas.length)
                    res.json(archivos_y_carpetas);
            });
        }
        //de lo contrario, enviamos un arreglo vacío
        else
            res.json([]);

    } catch (error) {

        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

module.exports = router;