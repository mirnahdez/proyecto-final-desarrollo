const express = require('express');
const router = express.Router();
const { usuario, usuario_lectura } = require('./clases');
const { insertar_bd, leer_registros } = require('./conexion_bd');
const { validacion_entrada, usuario_logueado } = require('./varios');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

let llave_privada = 'Pr0y3ct0S3min@ri0.@r3@D3s@rr0ll0';


router.post('/usuario/nuevo', async (req, res) => {
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
            res.redirect(`/error/${'¡ERROR! No se pudo crear la carpeta por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);
            return;
        }

        let nuevo_usuario = new usuario(
            // req.body.id_usuario_creacion_usuario,
            usuario_logueado_actual.id_usuario,
            req.body.nombre_usuario,
            req.body.contrasenia_usuario,
            req.body.fecha_creacion_usuario,
            5
        );

        let entrada_valida = validacion_entrada('usuario', nuevo_usuario);

        if (entrada_valida) {

            //obtenemos el listado de usuarios con el mismo nombre
            let usuarios = await leer_registros('usuario', 'usuario_lectura', `nombre_usuario = '${nuevo_usuario.nombre_usuario}'`);

            //si hay algun usuario con ese nombre, no es posible crear uno nuevo
            if (usuarios.length > 0)
                res.redirect(`/error/${'¡ERROR! No se pudo crear el usuario, nombre de usuario existente. Por favor intenta nuevamente.'}`);
            else {

                bcrypt.hash(nuevo_usuario.contrasenia_usuario, 10, async (err, hash) => {
                    //Si hay algún error, redireccionamos a la vista de error
                    if (err) {
                        console.log(err);
                        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
                    }
                    else {

                        //asignamos al objeto la contrasenia cifrada
                        nuevo_usuario.contrasenia_usuario = hash;

                        //insertamos el nuevo usuario según la información enviada desde el cliente y la contrasenia cifrada
                        let resultado_insercion = await insertar_bd('usuario', nuevo_usuario);

                        if (resultado_insercion == 1)
                            res.redirect('/info/Usuario creado con éxito.');
                        else
                            res.redirect(`/error/${'¡ERROR! No se pudo crear el usuario. Por favor intenta nuevamente.'}`);
                    }
                });
            }
        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo crear el usuario, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})


router.get('/listado_usuarios', async (req, res) => {

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

        let usuarios = await leer_registros('usuario', 'usuario_lectura', '');
        let usuarios_sin_contrasenia = [];

        let contador = 0;

        if (usuarios.length > 0)
            usuarios.forEach(usuario_temp => {
                usuarios_sin_contrasenia.push(new usuario_lectura(usuario_temp.id_usuario, usuario_temp.id_usuario_creacion_usuario, usuario_temp.nombre_usuario, '', usuario_temp.fecha_creacion_usuario, usuario_temp.id_estado_usuario));

                contador++;

                if (contador == usuarios.length) {
                    res.json(usuarios_sin_contrasenia);
                }
            });
        else
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

router.post('/usuario/login', async (req, res) => {
    try {

        //si la solicitud no trae un cuerpo, devolvemos un error
        if (!req.body) {
            res.redirect(`/error/${'¡ERROR! No se pudo loguear el usuario por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);
            return;
        }

        let usuario_actual = new usuario_lectura(0, 0, req.body.nombre_usuario, req.body.contrasenia_usuario, '2024-01-01 00:00:00', 0);
        let entrada_valida = validacion_entrada('usuario', usuario_actual);

        //si la entrada es valida
        if (entrada_valida) {

            //obtenemos el usuario según nombre de usuario
            let usuarios = await leer_registros('usuario', 'usuario_lectura', `nombre_usuario = '${usuario_actual.nombre_usuario}'`)

            //si se obtuvo resultados
            if (usuarios.length > 0) {

                //comparamos la contrasenia ingresada contra el hash que se encuentra en la bd
                bcrypt.compare(usuario_actual.contrasenia_usuario, usuarios[0].contrasenia_usuario, function (err, son_iguales) {

                    if (err) {
                        console.log(err);
                        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
                    }
                    else {

                        //si coinciden
                        if (son_iguales) {

                            //Se encripta la información completa del usuario
                            let token = jwt.sign({
                                id_usuario: usuarios[0].id_usuario,
                                id_usuario_creacion_usuario: usuarios[0].id_usuario_creacion_usuario,
                                nombre_usuario: usuarios[0].nombre_usuario,
                                fecha_creacion_usuario: usuarios[0].fecha_creacion_usuario,
                                id_estado_usuario: usuarios[0].id_estado_usuario
                            }, llave_privada, { expiresIn: '2h' });

                            //Se devuelve el token al usuario
                            res.json({
                                token_usuario: token
                            })
                        }
                        else
                            res.redirect(`/error/${'¡ERROR! Usuario o contraseña incorrectos. Por favor intenta nuevamente.'}`);
                    }
                });
            }
            else
                res.redirect(`/error/${'¡ERROR! Usuario o contraseña incorrectos. Por favor intenta nuevamente.'}`);

        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo validar el usuario, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);
    }
})

router.get('/valida_token', (req, res) => {
    try {

        if (req.headers.authorization) {
            let usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if (!usuario_logueado_actual) {
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`);
                return;
            }
            else
                res.redirect('/info/Token válido.');
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
module.exports = router;