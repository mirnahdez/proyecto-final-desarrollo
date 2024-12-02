import React, { useEffect, useState } from 'react';
import { obtenerFechaActual, retornaInput, retornaLabel, retornaTextarea, ObtenerCookieSesion, urlAPI, EliminarCookieSesion } from '../funciones/general'
import UsarCtxProyectoActual from './CtxProyectoActual.js'
import UsarCtxCarpetaActual from './CtxCarpetaActual.js'
import useNavigation from './CtxVista.js'

export function ListarArchivosYCarpetas() {

    const [error, cambiarEstadoError] = useState(null);
    // const [mostrarArchivosHijos, cambiarEstadoMostrarArchivosHijos] = useState(null);
    const [archivosYCarpetas, cambiarEstadoArchivosYCarpetas] = useState([]); // Estado para guardar los datos
    const [nombre_archivo_o_carpeta, cambiarEstadoNombreArchivoOCarpeta] = useState('');
    const [descripcion_carpeta, cambiarEstadoDescripcionCarpeta] = useState('');
    const [extension_archivo, cambiarEstadoExtensionArchivo] = useState('');
    const [archivosCargados, cambiarEstadoArchivosCargados] = useState('');
    const [tipo_archivo, cambiarEstadoTipoArchivo] = useState('');
    const [vistaModal, cambiarEstadoModal] = useState('carpeta');
    const { proyectoActual } = UsarCtxProyectoActual();
    const { carpetaActual } = UsarCtxCarpetaActual();
    const { asignarCarpetaActual } = UsarCtxCarpetaActual();
    const { navigateTo } = useNavigation();

    const envioFormulario = (event) => {

        console.log('llamado a la función')
        //frenamos el evento submit del formulario
        event.preventDefault();

        //cambiamos el estado del error (de momento no hay ninguno), y de la variable que indica si el envío del formulario está en curso
        // cambiarEstadoCargando(true);
        cambiarEstadoError(null);

        let body = {};
        let endpoint = '';

        if (vistaModal === "carpeta") {

            body = {
                id_proyecto_asociado: proyectoActual,
                nombre_carpeta: nombre_archivo_o_carpeta,
                descripcion_carpeta: descripcion_carpeta,
                fecha_creacion_carpeta: obtenerFechaActual(),
                id_carpeta_asociada: carpetaActual,
                nivel_carpeta: 0
            };

            endpoint = urlAPI + 'proyecto/nueva_carpeta';
        }
        else if (vistaModal === "archivo") {

            body = {
                id_carpeta_asociada: carpetaActual,
                id_proyecto_asociado: proyectoActual,
                nombre_archivo: nombre_archivo_o_carpeta,
                extension_archivo: extension_archivo,
                peso_archivo: '0 kb',
                tipo_archivo: tipo_archivo,
                fecha_creacion_archivo: obtenerFechaActual()
            }

            endpoint = urlAPI + 'archivo/nuevo';
        }
        //realizamos un fetch para crear un nuevo proyecto
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ObtenerCookieSesion() },
            body: JSON.stringify(body),
        })
            .then((respuesta) => respuesta.json())
            .then((respuestaJson) => {
                // cambiarEstadoCargando(false);

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
                    navigateTo('actualizarListaArchivos');
                    // navigate('/'); // Redirige a la vista "/inicio"
                }
            })
            .catch((error) => {
                console.log('Dentro del catch');
                console.log(error);
                // cambiarEstadoCargando(false);
                cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
            });
    };

    // Función para realizar la llamada fetch y obtener los lenguajes de programación disponibles
    const obtenerArchivosYCarpetas = async () => {
        try {

            const respuesta = await fetch(`${urlAPI}archivo/listado_archivos/${carpetaActual}/${proyectoActual}`, {
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
                cambiarEstadoArchivosYCarpetas(respuestaJson); // Guardamos los datos en el estado
                return;
            }

        } catch (error) {
            console.log('Dentro del catch');
            console.log(error);
            // cambiarEstadoCargando(false);
            cambiarEstadoError('¡ERROR! Algo ha salido mal en tu navegador. Por favor intenta nuevamente.');
        }
    };

    //useEffect sirve para operaciones que ocurren fuera del flujo normal de renderizado de un componente
    useEffect(() => {

        console.log('Renderizando el componente')
        obtenerArchivosYCarpetas(); // Llamada a la función
        // document.getElementById('divArchivosYCarpetas').innerHTML = "";
        // cambiarEstadoMostrarArchivosHijos(false);
    }, []); // Después de agregar archivos o carpetas, debe obtenerse nuevamente la información 

    return (
        <div>

            <div id='divArchivosYCarpetas'>
                <div>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCrearCarpeta" data-bs-whatever="@mdo" onClick={() => cambiarEstadoModal('carpeta')}>Nueva carpeta</button>
                    {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalCrearArchivo" data-bs-whatever="@fat" onClick={() => cambiarEstadoModal('archivo')}>Nuevo archivo</button> */}
                    <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalCargarArchivos" data-bs-whatever="@fat" onClick={() => cambiarEstadoModal('archivo')}>Cargar archivo</button>
                </div>

                <div>
                    <ul className="list-group">

                        {archivosYCarpetas.map((archivoOCarpeta, index) => (
                            <li
                                key={index}
                                value={archivoOCarpeta.id}
                                className={`list-group-item ${archivoOCarpeta.tipo == 'carpeta' ? ' list-group-item-warning' : ''}`}
                                onDoubleClick={() => {
                                    if (archivoOCarpeta.tipo == 'carpeta'){
                                        asignarCarpetaActual(archivoOCarpeta.id);
                                        navigateTo('listarArchivos');
                                        obtenerArchivosYCarpetas();
                                        cambiarEstadoNombreArchivoOCarpeta('');
                                        cambiarEstadoDescripcionCarpeta('');
                                    }
                                    else
                                        window.open(urlAPI + archivoOCarpeta.url_archivo, '_blank');
                                }}
                            >
                                {archivoOCarpeta.nombre}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="modal fade" id="modalCrearCarpeta" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Nueva carpeta</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        {retornaLabel('nombre_archivo_o_carpeta', 'col-form-label', 'Nombre carpeta')}
                                        {retornaInput('text', 'form-control', 'nombre_archivo_o_carpeta', '', nombre_archivo_o_carpeta, cambiarEstadoNombreArchivoOCarpeta)}
                                    </div>

                                    <div className="mb-3">
                                        {retornaLabel('descripcion_carpeta', 'col-form-label', 'Descripción')}
                                        {retornaTextarea('', 'form-control', 'descripcion_carpeta', 2, '', descripcion_carpeta, cambiarEstadoDescripcionCarpeta)}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => navigateTo('listarArchivos')} data-bs-dismiss="modal">Cerrar</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    onClick={(event) => {
                                        envioFormulario(event);
                                        obtenerArchivosYCarpetas();
                                        cambiarEstadoNombreArchivoOCarpeta('');
                                        cambiarEstadoDescripcionCarpeta('');
                                    }}
                                >
                                    Crear carpeta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalCrearArchivo" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Nuevo archivo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        {retornaLabel('nombre_archivo_o_carpeta', 'col-form-label', 'Nombre archivo')}
                                        {retornaInput('text', 'form-control', 'nombre_archivo_o_carpeta', '', nombre_archivo_o_carpeta, cambiarEstadoNombreArchivoOCarpeta)}
                                    </div>

                                    <div className="mb-3">
                                        {retornaLabel('extension_archivo', 'col-form-label', 'Extensión')}
                                        {retornaInput('text', 'form-control', 'extension_archivo', '', extension_archivo, cambiarEstadoExtensionArchivo)}
                                    </div>

                                    <div>
                                        {retornaLabel("tipo_archivo", "form-label", "Selecciona el tipo de archivo")}
                                        <select
                                            className="form-select"
                                            aria-label="Tipo archivo"
                                            onChange={(event) => cambiarEstadoTipoArchivo(event.target.value)}
                                            id='tipo_archivo'
                                            name='tipo_archivo'
                                            value={tipo_archivo}
                                        >
                                            <option value="texto">Texto</option>
                                            <option value="video">Video</option>
                                            <option value="ofimatica">Ofimática</option>
                                            <option value="imagen">Imagen</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={(event) => {
                                        envioFormulario(event);
                                        obtenerArchivosYCarpetas();
                                        cambiarEstadoNombreArchivoOCarpeta('');
                                        cambiarEstadoExtensionArchivo('');
                                        cambiarEstadoTipoArchivo('');
                                    }}
                                >
                                    Crear archivo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalCargarArchivos" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Carga de archivos</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <CargarArchivo idCarpetaAsociada={carpetaActual} idProyectoAsociado={proyectoActual} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


export function CargarArchivo({ idProyectoAsociado, idCarpetaAsociada }) {
    const [archivo, setArchivo] = useState(null); // Estado para guardar el archivo seleccionado
    const [mensaje, setMensaje] = useState('');   // Estado para mostrar mensajes

    // Manejar el archivo seleccionado
    const manejarArchivo = (event) => {
        setArchivo(event.target.files[0]); // Guardamos el archivo seleccionado
    };

    // Manejar el envío del archivo al servidor
    const enviarArchivo = async (event) => {

        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        if (!archivo) {
            setMensaje('Por favor, selecciona un archivo antes de enviarlo.');
            return;
        }

        const formData = new FormData(); // Crear un FormData para enviar el archivo
        formData.append('archivo', archivo); // Añadir el archivo bajo la clave 'archivo'
        formData.append('nombre_archivo', archivo.name);
        formData.append('id_carpeta_asociada', idCarpetaAsociada);
        formData.append('id_proyecto_asociado', idProyectoAsociado);
        formData.append('extension_archivo', archivo.name.split('.').pop());
        formData.append('peso_archivo', `${(archivo.size / 1024).toFixed(2)} kb`);
        formData.append('tipo_archivo', archivo.type.split('/')[1]);
        formData.append('fecha_creacion_archivo', obtenerFechaActual());

        // console.log(archivo)
        try {
            const respuesta = await fetch(urlAPI + 'archivo/cargar_archivo', {
                headers: { 'Authorization': 'Bearer ' + ObtenerCookieSesion() },
                method: 'POST',
                body: formData, // Enviar el FormData
            });

            let respuestaJson = await respuesta.json();

            if (!respuestaJson.mensaje_error) {
                // setMensaje('Archivo enviado con éxito.');
                setMensaje(respuestaJson.info);

            } else {
                // setMensaje('Error al enviar el archivo.');
                setMensaje(respuestaJson.mensaje_error);

                if (respuestaJson.mensaje_error.includes('No se pudo obtener la información del usuario logueado'))
                    EliminarCookieSesion();
            }

        } catch (error) {
            setMensaje('Hubo un problema con la carga: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Cargar Archivo</h2>
            <form onSubmit={enviarArchivo}>
                <input
                    type="file"
                    accept=".jpg,.png,.pdf,.txt,.js,.html" // Tipos de archivo permitidos
                    onChange={manejarArchivo}
                />
                <button type="submit">Subir Archivo</button>
            </form>
            {mensaje && <p>{mensaje}</p>} {/* Mostrar mensajes */}
        </div>
    );
}



export function CrearArchivo({ nombreArchivo }) {
    const [contenido, setContenido] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Función para manejar la carga del archivo
    const manejarEnvio = async (e) => {
        e.preventDefault();

        const blob = new Blob([contenido], { type: 'text/plain' });
        const archivo = new File([blob], nombreArchivo, { type: 'text/plain' });

        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            const respuesta = await fetch(urlAPI + 'upload', {
                method: 'POST',
                body: formData,
            });

            if (respuesta.ok) {
                const resultado = await respuesta.json();
                setMensaje(`Archivo subido: ${resultado.filePath}`);
            } else {
                setMensaje('Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error al enviar el archivo:', error);
            setMensaje('Error al subir el archivo');
        }
    };

    return (
        <div>
            <h1>Cargar Archivo de Texto</h1>
            <textarea
                rows="10"
                cols="50"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe el contenido aquí..."
            />
            <br />
            <button onClick={manejarEnvio}>Crear y Subir Archivo</button>
            <p>{mensaje}</p>
        </div>
    );
};

export function ActualizarArchivosYCarpetas(){
    return(
        <ListarArchivosYCarpetas></ListarArchivosYCarpetas>
    )
}
// export default CargarArchivo;

