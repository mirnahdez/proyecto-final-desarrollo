import { EliminarCookieSesion } from '../funciones/general'
import useNavigation from './CtxVista.js'

export function BarraNavegacion() {
    const { navigateTo } = useNavigation();

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#"></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" onClick={() => navigateTo('menuPrincipal')} aria-current="page" href="#">Inicio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigateTo('crearUsuario')} href="#">Nuevo usuario</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => { EliminarCookieSesion(); navigateTo('login') }} href="#">Cerrar Sesión</a>
                        </li>
                        {/* <li className="nav-item">
                    <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li> */}
                    </ul>
                </div>
            </div>
        </nav>
    );
}



