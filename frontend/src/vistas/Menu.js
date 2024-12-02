import useNavigation from './CtxVista.js'

export function MenuPrincipal() {

    const { navigateTo } = useNavigation();

    return (
        <div className="container-fluid">
            <div className="list-group">
                {/* <a href="#" class="list-group-item list-group-item-action">A simple default list group item</a> */}
                <a href="#" onClick={() => navigateTo('listarProyectos')} className="list-group-item list-group-item-action list-group-item-primary">Gestión de Proyectos</a>
                {/* <a href="#" onClick={() => navigateTo('crearUsuario')} className="list-group-item list-group-item-action list-group-item-primary">Crear Usuario</a> */}
                {/* <a href="#" className="list-group-item list-group-item-action list-group-item-secondary">Gestión de Pruebas</a>
                <a href="#" className="list-group-item list-group-item-action list-group-item-success">Informes y Métricas</a> */}
                {/* <a href="#" class="list-group-item list-group-item-action list-group-item-danger">A simple danger list group item</a>
                <a href="#" class="list-group-item list-group-item-action list-group-item-warning">A simple warning list group item</a>
                <a href="#" class="list-group-item list-group-item-action list-group-item-info">A simple info list group item</a>
                <a href="#" class="list-group-item list-group-item-action list-group-item-light">A simple light list group item</a>
                <a href="#" class="list-group-item list-group-item-action list-group-item-dark">A simple dark list group item</a> */}
            </div>
        </div>
    );
}