const express = require('express');
const router = express.Router();
const {usuario_logueado} = require('./varios')
const { leer_registros } = require('./conexion_bd');


router.get('/error/:mensaje_error', (req, res)=>{
    const {mensaje_error} = req.params;

    res.json({
        mensaje_error: mensaje_error
    });
});

router.get('/info/:info', (req, res)=>{
    const {info} = req.params;

    res.json({
        info: info
    });
});

router.get('/lenguajes_programacion', async (req, res) =>{
    try {

        if(req.headers.authorization){
            let usuario_logueado_actual = usuario_logueado(req.headers.authorization.replace('Bearer ', ''));

            if(!usuario_logueado_actual){
                res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado. Por favor intenta nuevamente.'}`); 
                return;
            }    
        }
        else{
            res.redirect(`/error/${'¡ERROR! No se pudo obtener la información del usuario logueado (token no enviado). Por favor intenta nuevamente.'}`); 
            return;
        }

        //obtenemos el listado de lenguajes de programacion disponibles
        let lenguajes_programacion = await leer_registros('lenguaje', 'lenguaje_lectura', '');

        //enviamos los lenguajes de programacion encontrados
        res.json(lenguajes_programacion);

    } catch (error) {

        console.log(error);
        res.redirect(`/error/${'¡ERROR! Algo ha salido mal. Por favor intenta nuevamente.'}`);         
    }
})

module.exports = router;