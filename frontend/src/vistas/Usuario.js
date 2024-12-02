import React, { useState } from 'react';
import useNavigation from './CtxVista.js'
import { retornaInput, retornaLabel, obtenerFechaActual, ObtenerCookieSesion, urlAPI, EliminarCookieSesion } from '../funciones/general.js'

export const InicioSesion = () => {
  const [nombre_usuario, cambiarEstadoUsuario] = useState('');
  const [contrasenia_usuario, cambiarEstadoContrasenia] = useState('');
  const [error, cambiarEstadoError] = useState(null);
  const [cargando, cambiarEstadoCargando] = useState(false);
  const { navigateTo } = useNavigation();

  const envioFormulario = (event) => {

    //frenamos el evento submit del formulario
    event.preventDefault();

    //cambiamos el estado del error (de momento no hay ninguno), y de la variable que indica si el envío del formulario está en curso
    cambiarEstadoCargando(true);
    cambiarEstadoError(null);

    //realizamos un fetch para validar el usuario y contraseña en el servidor
    fetch(urlAPI + 'usuario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_usuario: nombre_usuario,
        contrasenia_usuario: contrasenia_usuario,
      }),
    })
      .then((respuesta) => respuesta.json())
      .then((respuestaJson) => {
        cambiarEstadoCargando(false);
        // console.log(respuestaJson);
        // console.log(respuestaJson.mensaje_error);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {

          // error = respuestaJson.mensaje_error;
          // console.log('Dentro del if, valor de error: ' + error)
          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, vamos al menú inicio
        else {
          console.log('Dentro del else');

          if (respuestaJson.token_usuario) {
            document.cookie = `sesion=${respuestaJson.token_usuario}`;
            console.log('Inicio de sesión exitoso');
            navigateTo('menuPrincipal');
            // navigate('/'); // Redirige a la vista "/inicio"
          }
          else
            cambiarEstadoError('¡ERROR! No se pudo obtener el identificador de sesión. Por favor intenta nuevamente.');
        }
      })
      .catch((error) => {
        console.log('Dentro del catch');
        console.log(error);
        cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      });
  };

  return (
    <form onSubmit={envioFormulario}>
      <div className="mb-3">
        {retornaLabel("nombre_usuario", "form-label", "Usuario")}
        {retornaInput("text", "form-control", "nombre_usuario", "", nombre_usuario, cambiarEstadoUsuario)}
      </div>
      <div className="mb-3">
        {retornaLabel("contrasenia_usuario", "form-label", "Contraseña")}
        {retornaInput("password", "form-control", "contrasenia_usuario", "", contrasenia_usuario, cambiarEstadoContrasenia)}
      </div>
      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}
      <button
        className="btn btn-primary"
        type="submit"
        disabled={cargando}
      >
        {cargando ? 'Cargando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
};

export function CrearUsuario() {

  const [nombre_usuario, cambiarEstadoUsuario] = useState('');
  const [contrasenia_usuario, cambiarEstadoContrasenia] = useState('');
  const [error, cambiarEstadoError] = useState(null);
  const [cargando, cambiarEstadoCargando] = useState(false);
  const { navigateTo } = useNavigation();

  const envioFormulario = (event) => {

    //frenamos el evento submit del formulario
    event.preventDefault();

    //cambiamos el estado del error (de momento no hay ninguno), y de la variable que indica si el envío del formulario está en curso
    cambiarEstadoCargando(true);
    cambiarEstadoError(null);

    //realizamos un fetch para validar el usuario y contraseña en el servidor
    fetch(urlAPI + 'usuario/nuevo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() },
      body: JSON.stringify({
        nombre_usuario: nombre_usuario,
        contrasenia_usuario: contrasenia_usuario,
        fecha_creacion_usuario: obtenerFechaActual()
      }),
    })
      .then((respuesta) => respuesta.json())
      .then((respuestaJson) => {
        cambiarEstadoCargando(false);
        // console.log(respuestaJson);
        // console.log(respuestaJson.mensaje_error);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {

          // error = respuestaJson.mensaje_error;
          // console.log('Dentro del if, valor de error: ' + error)
          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, vamos al menú inicio
        else {
          console.log('Dentro del else');
          console.log('Usuario creado');
          navigateTo('login');
        }
      })
      .catch((error) => {
        console.log('Dentro del catch');
        console.log(error);
        cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      });
  };

  return (
    <form onSubmit={envioFormulario}>
      <div className="mb-3">
        {retornaLabel("nombre_usuario", "form-label", "Usuario")}
        {retornaInput("text", "form-control", "nombre_usuario", "", nombre_usuario, cambiarEstadoUsuario)}
      </div>
      <div className="mb-3">
        {retornaLabel("contrasenia_usuario", "form-label", "Contraseña")}
        {retornaInput("password", "form-control", "contrasenia_usuario", "", contrasenia_usuario, cambiarEstadoContrasenia)}
      </div>
      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}
      <button
        className="btn btn-primary"
        type="submit"
        disabled={cargando}
      >
        {cargando ? 'Cargando...' : 'Crear usuario'}
      </button>
    </form>
  );
}

// export default LoginForm;