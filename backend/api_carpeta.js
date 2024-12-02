const express = require('express');
const router = express.Router();
const { carpeta } = require('./clases');
const { insertar_bd, leer_registros } = require('./conexion_bd');
const {validacion_entrada, usuario_logueado} = require('./varios')

router.post('/proyecto/nueva_carpeta', async (req, res) =>{

    try {
        
        let usuario_logueado_actual = 0; 

        if(req.headers.authorization){
            usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if(!usuario_logueado_actual){
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`); 
                return;
            }    
        }
        else{
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`); 
            return;
        }

        //si la solicitud no trae un cuerpo, devolvemos un error
        if(!req.body){
            res.redirect(`/error/${'¡ERROR! No se pudo crear la carpeta por falta de parámetros en la solicitud. Por favor intenta nuevamente.'}`);  
            return;
        }

        //creamos el objeto tipo carpeta
        let carpeta_nueva = new carpeta(
            req.body.id_proyecto_asociado,
            req.body.nombre_carpeta,
            req.body.descripcion_carpeta,
            usuario_logueado_actual.id_usuario,
            req.body.fecha_creacion_carpeta,
            req.body.id_carpeta_asociada,
            req.body.nivel_carpeta
        );

        //validamos la información ingresada
        let entrada_valida = validacion_entrada('carpeta', carpeta_nueva);

        //si la información ingresada es válida
        if(entrada_valida){

            //obtenemos el listado de carpetas con el mismo nombre y carpeta madre, y bajo el mismo proyecto
            let carpetas = await leer_registros('carpeta', 'carpeta_lectura', `nombre_carpeta = '${req.body.nombre_carpeta}' and id_proyecto_asociado = ${req.body.id_proyecto_asociado} and id_carpeta_asociada = ${req.body.id_carpeta_asociada}`);
            
            //si hay algun proyecto con ese nombre, no es posible crear uno nuevo
            if(carpetas.length > 0) 
                res.redirect(`/error/${'¡ERROR! No se pudo crear la carpeta, nombre de carpeta existente. Por favor intenta nuevamente.'}`);
            else{
                //insertamos la nueva carpeta según la información enviada desde el cliente
                let resultado_insercion = await insertar_bd('carpeta', carpeta_nueva);

                //si se insertó el registro, enviamos mensaje de éxito, de lo contrario, un error
                if(resultado_insercion == 1)
                    res.redirect('/info/Carpeta creada con éxito.');
                else
                    res.redirect(`/error/${'¡ERROR! No se pudo crear la carpeta. Por favor intenta nuevamente.'}`);
            }
        }
        else
            res.redirect(`/error/${'¡ERROR! No se pudo crear la carpeta, entrada no válida (caracteres especiales, formato incorrecto). Por favor intenta nuevamente.'}`);

    } catch (error) {
        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);              
    }
})

router.get('/proyecto/:nombre_proyecto/:nombre_carpeta/listado_carpetas', async (req, res)=>{

    //leemos la información de la base de datos para obtener el proyecto, según el nombre ingresado y el usuario que lo creó
    // IMPORTANTE: Debe validarse la info antes de mandarla directo al script. El usuario debería tomarse según la sesión.
    
    let carpetas = await leer_registros('carpeta', 'carpeta_lectura', `id_carpeta_asociada = '${req.body.id_carpeta}' and id_proyecto_asociado = '${req.body.id_proyecto_asociado}'`)
    
    if(carpetas.length > 0) 
        res.json(carpetas);
    else
        res.redirect(`/info/${'Aún no hay carpetas creadas.'}`); 

    // if(carpeta_creada)
    // {
    //     if(carpeta_creada.length > 0){
    //         let carpetas = await leer_registros('carpeta', 'carpeta_lectura', `nombre_proyecto = '${nombre_proyecto}' and id_carpeta_asociada = ${carpeta_creada[0].id_carpeta}`)
    //         res.json(carpetas);
    //     }
    //     else
    //         res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`); 
    // }
    // else
    //     res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`); 

    // if(carpetas)
    //     res.json(carpetas);
    // else
    //     res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`); 
})


router.get('/proyecto/:nombre_proyecto/:nombre_carpeta/:id_carpeta/:id_proyecto_asociado/listado_carpetas', async (req, res)=>{

    //leemos la información de la base de datos para obtener el proyecto, según el nombre ingresado y el usuario que lo creó
    // IMPORTANTE: Debe validarse la info antes de mandarla directo al script. El usuario debería tomarse según la sesión.
    // console.log(req.body);

    // let carpeta_creada = await leer_registros('carpeta', 'carpeta_lectura', `id_carpeta_asociada = '${req.body.id_carpeta_asociada}' and id_proyecto_asociado = '${req.body.id_proyecto_asociado}'`);
    // console.log('Dentro del redirect')
    
    let carpetas = await leer_registros('carpeta', 'carpeta_lectura', `id_carpeta_asociada = '${req.params.id_carpeta}' and id_proyecto_asociado = '${req.params.id_proyecto_asociado}'`)
    
    console.log(carpetas)
    if(carpetas.length > 0) 
        res.json(carpetas);
    else
        res.redirect(`/info/${'Aún no hay carpetas creadas.'}`); 
    // if(carpeta_creada)
    // {
    //     if(carpeta_creada.length > 0){
    //         let carpetas = await leer_registros('carpeta', 'carpeta_lectura', `nombre_proyecto = '${nombre_proyecto}' and id_carpeta_asociada = ${carpeta_creada[0].id_carpeta}`)
    //         res.json(carpetas);
    //     }
    //     else
    //         res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`); 
    // }
    // else
    //     res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`); 

    // if(carpetas)
    //     res.json(carpetas);
    // else
    //     res.redirect(`/error/${'¡ERROR! No se pudo obtener la información. Por favor intenta nuevamente.'}`); 
})

module.exports = router;
