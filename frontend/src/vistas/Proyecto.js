import React, { useEffect, useState } from 'react';
import { ObtenerCookieSesion, obtenerFechaActual, retornaInput, retornaLabel, retornaTextarea, urlAPI, EliminarCookieSesion } from '../funciones/general.js'
import useNavigation from './CtxVista.js'
import UsarCtxProyectoActual from './CtxProyectoActual.js'
import UsarCtxCarpetaActual from './CtxCarpetaActual.js'

export function CrearProyecto() {

  const [nombre_proyecto, cambiarEstadoNombreProyecto] = useState('');
  const [descripcion_proyecto, cambiarEstadoDescripcionProyecto] = useState('');
  const [version_lenguaje, cambiarEstadoVersionLenguaje] = useState('');
  const [id_estado_proyecto, cambiarEstadoIdEstadoProyecto] = useState('');
  const [lenguajesProgramacion, cambiarEstadolenguajesProgramacion] = useState([]); // Estado para guardar los datos
  const [id_lenguaje, cambiarEstadoLenguajeSeleccionado] = useState(""); // Estado para el valor seleccionado
  const [error, cambiarEstadoError] = useState(null);
  const [cargando, cambiarEstadoCargando] = useState(false);
  const { navigateTo } = useNavigation();

  //useEffect sirve para operaciones que ocurren fuera del flujo normal de renderizado de un componente
  useEffect(() => {

    // Función para realizar la llamada fetch y obtener los lenguajes de programación disponibles
    const obtenerLenguajesProgramacion = async () => {
      try {

        const respuesta = await fetch(urlAPI + 'lenguajes_programacion', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() }
        });

        const respuestaJson = await respuesta.json(); // Parseamos la respuesta como JSON
        cambiarEstadoCargando(false);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {
          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, adjuntamos los lenguajes de programación obtenidos
        else {
          console.log('Dentro del else');
          cambiarEstadolenguajesProgramacion(respuestaJson); // Guardamos los datos en el estado
        }

      } catch (error) {
        console.log('Dentro del catch');
        console.log(error);
        cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      }
    };

    obtenerLenguajesProgramacion(); // Llamada a la función

  }, []); // El array vacío significa que se ejecuta solo una vez al montar el componente

  const cambiarLenguajeSeleccionado = (e) => {
    cambiarEstadoLenguajeSeleccionado(e.target.value); // Actualizamos el estado con el valor seleccionado
  };

  const envioFormulario = (event) => {

    //frenamos el evento submit del formulario
    event.preventDefault();

    //cambiamos el estado del error (de momento no hay ninguno), y de la variable que indica si el envío del formulario está en curso
    cambiarEstadoCargando(true);
    cambiarEstadoError(null);

    //realizamos un fetch para crear un nuevo proyecto
    fetch(urlAPI + 'proyecto/nuevo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() },
      body: JSON.stringify({
        nombre_proyecto: nombre_proyecto,
        descripcion_proyecto: descripcion_proyecto,
        id_lenguaje_proyecto: id_lenguaje,
        version_lenguaje: version_lenguaje,
        fecha_creacion_proyecto: obtenerFechaActual(),
        fecha_finalizacion_proyecto: obtenerFechaActual(),
        id_estado_proyecto: id_estado_proyecto
      }),
    })
      .then((respuesta) => respuesta.json())
      .then((respuestaJson) => {
        cambiarEstadoCargando(false);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {

          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, vamos al menú inicio
        else {
          console.log('Dentro del else');
          console.log(respuestaJson.info);
          navigateTo('listarProyectos');
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
      <div>
        <div className="mb-3">
          {retornaLabel("nombre_proyecto", "form-label", "Nombre Proyecto")}
          {retornaInput("text", "form-control", "nombre_proyecto", "div_especificaciones_nombre_proyecto", nombre_proyecto, cambiarEstadoNombreProyecto)}
          <div id="div_especificaciones_nombre_proyecto" className="form-text">
            El nombre del proyecto no debe contener caracteres especiales como *, #, %, /, &, ', ", \.
          </div>
        </div>
        <div className="mb-3">
          {retornaLabel("descripcion_proyecto", "form-label", "Descripción Proyecto")}
          {retornaTextarea("div_especificaciones_descripcion_proyecto", "form-control", "descripcion_proyecto", "3", "", descripcion_proyecto, cambiarEstadoDescripcionProyecto)}
          <div id="div_especificaciones_descripcion_proyecto" className="form-text">
            La descripción del proyecto no debe contener caracteres especiales como *, #, %, /, &, ', ", \.
          </div>
        </div>
        <div>
          {retornaLabel("id_lenguaje", "form-label", "Selecciona el lenguaje de programación")}
          <select
            id="id_lenguaje"
            value={id_lenguaje}
            onChange={cambiarLenguajeSeleccionado}
            className="form-select"
          >
            <option value="0">Selecciona una opción</option>
            {lenguajesProgramacion.map((lenguaje, index) => (
              <option key={index} value={lenguaje.id_lenguaje}>
                {lenguaje.nombre_lenguaje}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          {retornaLabel("version_lenguaje", "form-label", "Versión lenguaje")}
          {retornaInput("text", "form-control", "version_lenguaje", "", version_lenguaje, cambiarEstadoVersionLenguaje)}
        </div>
        <div>
          {retornaLabel("id_estado_proyecto", "form-label", "Selecciona el estado del proyecto")}
          <select
            className="form-select"
            aria-label="Estado proyecto"
            onChange={(event) => cambiarEstadoIdEstadoProyecto(event.target.value)}
            id='id_estado_proyecto'
            name='id_estado_proyecto'
          >
            <option value="0">Selecciona una opción</option>
            <option value="1">Desarrollo</option>
            <option value="2">Pruebas</option>
            <option value="3">Producción</option>
          </select>
        </div>
      </div>
      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={cargando}
      >
        {cargando ? 'Cargando...' : 'Crear Proyecto'}
      </button>
    </form>
  );
}

export function ListarProyectos() {

  const [proyectos, cambiarEstadoProyectos] = useState([]); // Estado para guardar los datos
  const [error, cambiarEstadoError] = useState(null);
  const { navigateTo } = useNavigation();
  const { asignarProyectoActual } = UsarCtxProyectoActual();
  const { asignarCarpetaActual } = UsarCtxCarpetaActual();

  //useEffect sirve para operaciones que ocurren fuera del flujo normal de renderizado de un componente
  useEffect(() => {

    // Función para realizar la llamada fetch y obtener los lenguajes de programación disponibles
    const obtenerProyectos = async () => {
      try {

        const respuesta = await fetch(urlAPI + 'proyecto/listado_proyectos', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() }
        });

        const respuestaJson = await respuesta.json(); // Parseamos la respuesta como JSON
        // cambiarEstadoCargando(false);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {
          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, adjuntamos los lenguajes de programación obtenidos
        else {
          // console.log('Dentro del else');
          cambiarEstadoProyectos(respuestaJson); // Guardamos los datos en el estado
          // console.log(respuestaJson)
          // console.log(respuestaJson[0].id_proyecto)

        }

      } catch (error) {
        console.log('Dentro del catch');
        console.log(error);
        // cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      }
    };

    obtenerProyectos(); // Llamada a la función

  }, []); // El array vacío significa que se ejecuta solo una vez al montar el componente


  return (

    <div>

      <div>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => navigateTo('crearProyecto')}
        >Crear Proyecto</button>
        <div className='table table-responsive'>
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th hidden scope="col">ID Proyecto</th>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
                <th scope="col">Fecha creación</th>
                <th scope="col">Fecha finalización</th>
                <th scope="col">Estado</th>
                <th scope="col">Opciones</th>
              </tr>
            </thead>
            <tbody>

              {/*proyectos.map((proyecto, index) => (
                <tr key={index}>
                  <th hidden scope="row">{proyecto.proyecto_creado ? proyecto.proyecto_creado.id_proyecto : proyecto.proyecto_asignado.id_proyecto}</th>
                  <td>{proyecto.proyecto_creado ? proyecto.proyecto_creado.nombre_proyecto : proyecto.proyecto_asignado.nombre_proyecto}</td>
                  <td>{proyecto.proyecto_creado ? proyecto.proyecto_creado.descripcion_proyecto : proyecto.proyecto_asignado.descripcion_proyecto}</td>
                  <td>{proyecto.proyecto_creado ? proyecto.proyecto_creado.fecha_creacion_proyecto : proyecto.proyecto_asignado.fecha_creacion_proyecto}</td>
                  <td>{proyecto.proyecto_creado ? proyecto.proyecto_creado.fecha_finalizacion_proyecto == proyecto.proyecto_creado.fecha_creacion_proyecto ? "N/A" : proyecto.proyecto_creado.fecha_finalizacion_proyecto : proyecto.proyecto_asignado.fecha_finalizacion_proyecto == proyecto.proyecto_asignado.fecha_creacion_proyecto ? "N/A" : proyecto.proyecto_asignado.fecha_finalizacion_proyecto}</td>
                  <td>{proyecto.proyecto_creado ? proyecto.proyecto_creado.id_estado_proyecto == 1 ? "Desarrollo" : proyecto.proyecto_creado.id_estado_proyecto == 2 ? "Pruebas" : "Producción" : proyecto.proyecto_asignado.id_estado_proyecto == 1 ? "Desarrollo" : proyecto.proyecto_asignado.id_estado_proyecto == 2 ? "Pruebas" : "Producción"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        // cambiarProyectoSeleccionadoEdicion(proyecto.id_proyecto);
                        // cambiarEstadoVistaProyecto('edicionProyecto');
                        asignarProyectoActual(proyecto.proyecto_creado ? proyecto.proyecto_creado.id_proyecto : proyecto.proyecto_asignado.id_proyecto);
                        navigateTo('editarProyecto');
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        asignarCarpetaActual(0);
                        asignarProyectoActual(proyecto.proyecto_creado ? proyecto.proyecto_creado.id_proyecto : proyecto.proyecto_asignado.id_proyecto);
                        navigateTo('listarArchivos');
                        // cambiarProyectoSeleccionadoDetalle({ idProyecto: proyecto.id_proyecto, idCarpetaAsociada: 0 });
                        // cambiarEstadoVistaProyecto('detalleProyecto');
                      }}
                    >
                      Detalle
                    </button>
                  </td>
                </tr>
              ))*/}

              {proyectos.map((proyecto, index) => (
                <tr key={index}>
                  <th hidden scope="row">{proyecto.id_proyecto}</th>
                  <td>{proyecto.nombre_proyecto}</td>
                  <td>{proyecto.descripcion_proyecto}</td>
                  <td>{proyecto.fecha_creacion_proyecto}</td>
                  <td>{proyecto.fecha_finalizacion_proyecto == proyecto.fecha_creacion_proyecto ? "N/A" : proyecto.fecha_finalizacion_proyecto}</td>
                  <td>{proyecto.id_estado_proyecto == 1 ? "Desarrollo" : proyecto.id_estado_proyecto == 2 ? "Pruebas" : "Producción"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        // cambiarProyectoSeleccionadoEdicion(proyecto.id_proyecto);
                        // cambiarEstadoVistaProyecto('edicionProyecto');
                        asignarProyectoActual(proyecto.id_proyecto);
                        navigateTo('editarProyecto');
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        asignarCarpetaActual(0);
                        asignarProyectoActual(proyecto.id_proyecto);
                        navigateTo('listarArchivos');
                        // cambiarProyectoSeleccionadoDetalle({ idProyecto: proyecto.id_proyecto, idCarpetaAsociada: 0 });
                        // cambiarEstadoVistaProyecto('detalleProyecto');
                      }}
                    >
                      Detalle
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          {error && (
            <div className="mb-4 text-red-500">{error}</div>
          )}
        </div>

      </div>

    </div>
  )
}


export function AsignarYEditarProyecto() {

  const [nombre_proyecto, cambiarEstadoNombreProyecto] = useState('');
  const [descripcion_proyecto, cambiarEstadoDescripcionProyecto] = useState('');
  const [version_lenguaje, cambiarEstadoVersionLenguaje] = useState('');
  const [id_estado_proyecto, cambiarEstadoIdEstadoProyecto] = useState('');
  const [lenguajesProgramacion, cambiarEstadolenguajesProgramacion] = useState([]); // Estado para guardar los datos
  const [id_lenguaje, cambiarEstadoLenguajeSeleccionado] = useState(""); // Estado para el valor seleccionado
  const [cargando, cambiarEstadoCargando] = useState(false);
  const [error, cambiarEstadoError] = useState(null);
  const [usuarios, cambiarEstadoUsuarios] = useState([]); // Estado para guardar los datos
  const [usuarios_asignados, cambiarEstadoUsuariosAsignados] = useState([]); // Estado para guardar los datos
  const { proyectoActual } = UsarCtxProyectoActual();
  const { navigateTo } = useNavigation();
  // let initialCheckboxes = [];
  // const [checkboxes, setCheckboxes] = useState(initialCheckboxes);

  // const handleCheckboxChange = (id) => {
  //   setCheckboxes((prevState) =>
  //     prevState.map((checkbox) =>
  //       checkbox.id === id
  //         ? { ...checkbox, checked: !checkbox.checked }
  //         : checkbox
  //     )
  //   );
  // };

  function asignarUsuario(id_usuario_asignado) {

    // if(this.checked)
    //   this.checked = false;
    // else this.checked = true;
    // // console.log()
    // console.log(event)
    // console.log(this)
    // let chekboxActual = document.querySelectorAll(`input[value="${id_usuario_asignado}"]`)
    // // chekboxActual[0].checked = chekboxActual[0].checked ? false : true;
    // // console.log(chekboxActual);
    // // console.log(chekboxActual[0].checked)

    // document.querySelectorAll(`input[value="${id_usuario_asignado}"]`)[0].checked = chekboxActual[0].checked ? false : true;
  }

  //useEffect sirve para operaciones que ocurren fuera del flujo normal de renderizado de un componente
  useEffect(() => {

    // Función para realizar la llamada fetch y obtener los lenguajes de programación disponibles
    const ObtenerUsuarios = async () => {
      try {

        const respuesta = await fetch(urlAPI + 'listado_usuarios', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() }
        });

        const respuestaJson = await respuesta.json(); // Parseamos la respuesta como JSON
        // cambiarEstadoCargando(false);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {
          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, adjuntamos los lenguajes de programación obtenidos
        else {
          console.log('Dentro del else');
          cambiarEstadoUsuarios(respuestaJson); // Guardamos los datos en el estado
        }

      } catch (error) {
        console.log('Dentro del catch');
        console.log(error);
        // cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      }
    };

    // Función para realizar la llamada fetch y obtener los lenguajes de programación disponibles
    const obtenerLenguajesProgramacion = async () => {
      try {

        const respuesta = await fetch(urlAPI + 'lenguajes_programacion', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() }
        });

        const respuestaJson = await respuesta.json(); // Parseamos la respuesta como JSON
        cambiarEstadoCargando(false);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {
          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, adjuntamos los lenguajes de programación obtenidos
        else {
          console.log('Dentro del else');
          cambiarEstadolenguajesProgramacion(respuestaJson); // Guardamos los datos en el estado
        }

      } catch (error) {
        console.log('Dentro del catch');
        console.log(error);
        cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      }
    };

    obtenerLenguajesProgramacion(); // Llamada a la función

    // obtenerInformacionProyecto(); // Llamada a la función
    ObtenerUsuarios();

  }, []); // El array vacío significa que se ejecuta solo una vez al montar el componente


  //useEffect sirve para operaciones que ocurren fuera del flujo normal de renderizado de un componente
  useEffect(() => {

    // Función para realizar la llamada fetch y obtener la información del usuario
    const obtenerInformacionProyecto = async () => {
      try {

        const respuesta = await fetch(urlAPI + `proyecto/informacion_proyecto/${proyectoActual}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() }
        });

        const respuestaJson = await respuesta.json(); // Parseamos la respuesta como JSON
        // cambiarEstadoCargando(false);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {
          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, adjuntamos los lenguajes de programación obtenidos
        else {
          console.log('Dentro del else');
          // cambiarEstadoProyecto(respuestaJson); // Guardamos los datos en el estado


          //si se obtuvo información del proyecto seleccionado, cambiamos el estado de las variables
          if (respuestaJson) {
            // console.log(respuestaJson);
            // console.log(respuestaJson.proyecto_buscado);
            // console.log(respuestaJson.proyecto_buscado.nombre_proyecto);

            cambiarEstadoNombreProyecto(respuestaJson.proyecto_buscado.nombre_proyecto);
            cambiarEstadoDescripcionProyecto(respuestaJson.proyecto_buscado.descripcion_proyecto);
            cambiarEstadoVersionLenguaje(respuestaJson.proyecto_buscado.version_lenguaje);
            cambiarEstadoIdEstadoProyecto(respuestaJson.proyecto_buscado.id_estado_proyecto);
            cambiarEstadoLenguajeSeleccionado(respuestaJson.proyecto_buscado.id_lenguaje_proyecto);
            cambiarEstadoUsuariosAsignados(respuestaJson.asignaciones);

            // usuarios.forEach(usuario => {
            //   let temp = {
            //     id: usuario.id_usuario,
            //     label: usuario.nombre_usuario,
            //     checked: determinarCheckedUsuarioAsignado(usuario.id_usuario)
            //   }

            //   initialCheckboxes.push(temp);

            // });

            // setCheckboxes(initialCheckboxes);
          }
        }

      } catch (error) {
        console.log('Dentro del catch');
        console.log(error);
        // cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      }
    };

    obtenerInformacionProyecto(); // Llamada a la función

  }, []); // Se ejecutará después que cambie la condición del proyecto seleccionado

  const cambiarLenguajeSeleccionado = (e) => {
    cambiarEstadoLenguajeSeleccionado(e.target.value); // Actualizamos el estado con el valor seleccionado
  };

  const envioFormulario = (event) => {

    //frenamos el evento submit del formulario
    event.preventDefault();

    //cambiamos el estado del error (de momento no hay ninguno), y de la variable que indica si el envío del formulario está en curso
    cambiarEstadoCargando(true);
    cambiarEstadoError(null);

    //Obtenemos los usuarios seleccionados que se asignarán al proyecto
    const obtenerCheckboxSeleccionados = () => {
      const seleccionados = Array.from(
        document.querySelectorAll('input[type="checkbox"]:checked')
      ).map((checkbox) => parseInt(checkbox.value, 10)); // Obtener los valores seleccionados

      console.log('IDs seleccionados:', seleccionados);

      return seleccionados;
    };

    //realizamos un fetch para crear un nuevo proyecto
    fetch(urlAPI + 'proyecto/actualizar_proyecto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() },
      body: JSON.stringify({
        nombre_proyecto: nombre_proyecto,
        descripcion_proyecto: descripcion_proyecto,
        id_lenguaje_proyecto: id_lenguaje,
        version_lenguaje: version_lenguaje,
        fecha_creacion_proyecto: obtenerFechaActual(),
        fecha_finalizacion_proyecto: obtenerFechaActual(),
        id_estado_proyecto: id_estado_proyecto,
        usuarios_asignados: obtenerCheckboxSeleccionados()
      }),
    })
      .then((respuesta) => respuesta.json())
      .then((respuestaJson) => {
        cambiarEstadoCargando(false);

        //si el servidor devuelve algún mensaje de error, lo mostramos
        if (respuestaJson.mensaje_error) {

          cambiarEstadoError(respuestaJson.mensaje_error);

          if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
            EliminarCookieSesion();
        }
        //de lo contrario, vamos al menú inicio
        else {
          console.log('Dentro del else');
          console.log(respuestaJson.info);
          navigateTo('menuPrincipal');
          // navigate('/'); // Redirige a la vista "/inicio"
        }
      })
      .catch((error) => {
        console.log('Dentro del catch');
        console.log(error);
        cambiarEstadoCargando(false);
        cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
      });
  };


  // function determinarCheckedUsuarioAsignado(id_usuario) {

  //   let chequear = false;

  //   // console.log(usuarios_asignados)

  //   if (usuarios_asignados.length > 0)

  //     usuarios_asignados.forEach(usuario_asignado => {

  //       // console.log(usuario_asignado);

  //       // console.log('comparando usuario asignado: ' + usuario_asignado.id_usuario_asignado + ' con usuario actual: ' + id_usuario)
  //       if (usuario_asignado.id_usuario_asignado == id_usuario)
  //         chequear = true;

  //     });

  //   return chequear;
  // }

  return (
    <form onSubmit={envioFormulario}>
      <div>
        <div className="mb-3">
          {retornaLabel("nombre_proyecto", "form-label", "Nombre Proyecto")}
          {retornaInput("text", "form-control", "nombre_proyecto", "", nombre_proyecto, cambiarEstadoNombreProyecto, true)}
        </div>
        <div className="mb-3">
          {retornaLabel("descripcion_proyecto", "form-label", "Descripción Proyecto")}
          {retornaTextarea("div_especificaciones_descripcion_proyecto", "form-control", "descripcion_proyecto", "3", "", descripcion_proyecto, cambiarEstadoDescripcionProyecto)}
          <div id="div_especificaciones_descripcion_proyecto" className="form-text">
            La descripción del proyecto no debe contener caracteres especiales como *, #, %, /, &, ', ", \.
          </div>
        </div>
        <div>
          {retornaLabel("id_lenguaje", "form-label", "Selecciona el lenguaje de programación")}
          <select
            id="id_lenguaje"
            value={id_lenguaje}
            onChange={cambiarLenguajeSeleccionado}
            className="form-select"
          >
            <option value="0">Selecciona una opción</option>
            {lenguajesProgramacion.map((lenguaje, index) => (
              <option key={index} value={lenguaje.id_lenguaje}>
                {lenguaje.nombre_lenguaje}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          {retornaLabel("version_lenguaje", "form-label", "Versión lenguaje")}
          {retornaInput("text", "form-control", "version_lenguaje", "", version_lenguaje, cambiarEstadoVersionLenguaje)}
        </div>
        <div>
          {retornaLabel("id_estado_proyecto", "form-label", "Selecciona el estado del proyecto")}
          <select
            className="form-select"
            aria-label="Estado proyecto"
            onChange={(event) => cambiarEstadoIdEstadoProyecto(event.target.value)}
            id='id_estado_proyecto'
            name='id_estado_proyecto'
            value={id_estado_proyecto}
          >
            <option value="0">Selecciona una opción</option>
            <option value="1">Desarrollo</option>
            <option value="2">Pruebas</option>
            <option value="3">Producción</option>
          </select>
        </div>
        <div>
          {retornaLabel("", "form-label", "Usuarios asignados al proyecto: ")}

          {usuarios.map((usuario, index) => (
            <div key={index} className="form-check">

              {/* {determinarCheckedUsuarioAsignado(usuario.id_usuario) && (
                <input type='checkbox' className='form-check-input' id='id_usuario' value={usuario.id_usuario} checked onClick={(event) => {
                  // console.log(event.target)
                  event.target.checked = event.target.checked ? false : true;
                  console.log(event.target.checked)
                }} />
              )}
              {!determinarCheckedUsuarioAsignado(usuario.id_usuario) && (
                <input type='checkbox' className='form-check-input' id='id_usuario' value={usuario.id_usuario} />
              )} */}

              {retornaInput('checkbox', 'form-check-input', 'id_usuario', '', usuario.id_usuario, asignarUsuario)}
              {retornaLabel('id_usuario', 'form-check-label', usuario.nombre_usuario)}
              
            </div>
          ))}


          {/* {checkboxes.map((checkbox) => (
            <div key={checkbox.id}>
              <input
                type="checkbox"
                checked={checkbox.checked}
                className='form-check-input'
                value={checkbox.id}
                onChange={() => handleCheckboxChange(checkbox.id)}
              />
              <label key={checkbox.id} className='form-check-label'>
                {checkbox.label}
              </label>
            </div>

          ))} */}
        </div>
      </div>
      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={cargando}
      >
        {cargando ? 'Cargando...' : 'Actualizar Proyecto'}
      </button>
    </form>
  );
}

