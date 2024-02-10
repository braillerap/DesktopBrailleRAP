import { Outlet, Link } from "react-router-dom";
import PaperCanvas from "./PaperCanvas";
import Toolbar from "./Toolbar";



const Layout = () => {
  return (
    <>
        <div className="App">    
        
            
            <div className="pure-menu pure-menu-horizontal menu_font" role={'presentation'} >
            <nav>
                <ul className="pure-menu-list">
                <li className="pure-menu-item">
                    <Link to="/" className="pure-menu-link">Home</Link>
                </li>
                <li className="pure-menu-item">
                    <Link to="/data" className="pure-menu-link">Data</Link>
                </li>
                <li className="pure-menu-item">
                    <Link to="/file" className="pure-menu-link">Fichier</Link>
                </li>
                
                <li className="pure-menu-item">
                    <Link to="/addsvg" className="pure-menu-link">SVG</Link>
                </li>
                <li className="pure-menu-item">
                    <Link to="/addtext" className="pure-menu-link">Text</Link>
                </li>
                <li className="pure-menu-item">
                    <Link to="/position" className="pure-menu-link">Position</Link>
                </li>
                <li className="pure-menu-item">
                    <Link to="/print" className="pure-menu-link">Imprimer</Link>
                </li>
                <li className="pure-menu-item">
                    <Link to="/parameter" className="pure-menu-link">Paramètres</Link>
                </li>
                </ul>
                
            </nav>
            
            </div>
            <Toolbar/>   
            <div className="App-Space">
                <div className="App-Work">    
                    <div className="App-header">
                       
                        <PaperCanvas Id="canvasid"/>
                    </div>
                    <div className="App-function">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>  
    </>
  )
};

export default Layout;

