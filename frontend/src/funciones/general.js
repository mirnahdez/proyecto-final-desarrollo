export const urlAPI = 'http://localhost:3001/';
// export const urlAPI = 'http://18.227.102.64:3001/';

export function ObtenerCookieSesion() {

    let cookies = document.cookie.split(";"); // Divide la cadena de cookies en un array
    let cookieSesion = "sesion";

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // Elimina los espacios en blanco al principio y al final

        if (cookie.startsWith(cookieSesion + "=")) {
            return cookie.substring(cookieSesion.length + 1); // Retorna el valor de la cookie
        }
    }
    return null; // Si no se encuentra la cookie, retorna null
}

export function EliminarCookieSesion() {
    document.cookie = "sesion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Cookie de sesión eliminada");
}

export const obtenerFechaActual = () => {
    const fecha = new Date();

    const aaaa = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes (0-11, por eso +1)
    const dd = String(fecha.getDate()).padStart(2, '0');

    const hh = String(fecha.getHours()).padStart(2, '0');
    const min = String(fecha.getMinutes()).padStart(2, '0');
    const ss = String(fecha.getSeconds()).padStart(2, '0');

    return `${aaaa}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

/**
 * Devuelve un input con todos sus atributos.
 * @param {string} type Tipo de input
 * @param {string} className Clases css para dar formato al input
 * @param {string} id Id del input
 * @param {string} ariaDescribedby Opcional, en caso haya alguna aclaración sobre lo que debe llevar el input
 * @param {string} value El valor que contiene el input
 * @param {Function} funcionOnChange La función que se ejecutará cada vez que se cambie el valor del input
 * @returns 
 */
export function retornaInput(type, className, id, ariaDescribedby, value, funcionOnChange, deshabilitado, chequeado, multiple) {

    return (
        <input
            type={type}
            className={className}
            id={id}
            aria-describedby={ariaDescribedby}
            value={value}
            onChange={(event) => funcionOnChange(event.target.value)}
            disabled={deshabilitado}
            checked={chequeado}
            multiple={multiple}
        />
    )

}

export function retornaLabel(htmlFor, className, value) {
    return (
        <label
            htmlFor={htmlFor}
            className={className}
        >{value}
        </label>
    )
}

export function retornaTextarea(ariaDescribedby, className, id, rows, cols, value, funcionOnChange) {
    return (
        <textarea
            aria-describedby={ariaDescribedby}
            className={className}
            id={id}
            rows={rows}
            cols={cols}
            value={value}
            onChange={(event) => funcionOnChange(event.target.value)}
        ></textarea>
    )
}

// export async function usuarioLogueado() {

//     let token = ObtenerCookieSesion();

//     if (token) {
//         const respuesta = await fetch(`${urlAPI}valida_token`, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
//         });

//         const respuestaJson = await respuesta.json(); // Parseamos la respuesta como JSON
//         // cambiarEstadoCargando(false);

//         //si el servidor devuelve algún mensaje de error, lo mostramos
//         if (respuestaJson.mensaje_error) {
//             // cambiarEstadoError(respuestaJson.mensaje_error);
//             console.log(respuestaJson.mensaje_error);
//             return false;
//         }
//         //de lo contrario, adjuntamos los lenguajes de programación obtenidos
//         else {
//             // console.log('Dentro del else');
//             // cambiarEstadoArchivosYCarpetas(respuestaJson); // Guardamos los datos en el estado
//             console.log(respuestaJson.info);
//             return true;
//         }

//     }
//     else
//         return false;
// }