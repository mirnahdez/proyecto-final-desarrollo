// import logo from './logo.svg';
// import React, { useEffect, useState } from 'react';
import './App.css';
import { CrearProyecto, ListarProyectos, AsignarYEditarProyecto } from './vistas/Proyecto.js'
import { InicioSesion, CrearUsuario } from './vistas/Usuario.js'
import { ListarArchivosYCarpetas, ActualizarArchivosYCarpetas } from './vistas/Carpeta.js'
import useNavigation from './vistas/CtxVista.js'
// import UsarCtxProyectoActual from './vistas/CtxProyectoActual.js'
import { ObtenerCookieSesion } from './funciones/general.js';
// import PaginaPrincipal from './vistas/Inicio.js'
import { MenuPrincipal } from './vistas/Menu.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BarraNavegacion } from './vistas/Varios.js'

function App() {

  const { currentView } = useNavigation();
  const { navigateTo } = useNavigation();
  // const { proyectoActual } = UsarCtxProyectoActual();

  if (!ObtenerCookieSesion())
    navigateTo('login');

  return (

    <div>

      {currentView !== 'login' &&
        <BarraNavegacion />
      }

      {currentView === 'login' &&
        <InicioSesion />
      }

      {currentView === 'crearProyecto' &&
        <CrearProyecto />
      }

      {currentView === 'listarProyectos' &&
        <ListarProyectos />
      }

      {currentView === 'crearUsuario' &&
        <CrearUsuario />
      }

      {currentView === 'menuPrincipal' &&
        <MenuPrincipal />
      }

      {currentView === 'editarProyecto' &&
        <AsignarYEditarProyecto />
      }

      {currentView === 'listarArchivos' &&
        <ListarArchivosYCarpetas />
      }

      {currentView === 'actualizarListaArchivos' &&
        <ActualizarArchivosYCarpetas />
      }


    </div>

  )
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>

  // );

}

export default App;
