import { useContext, useEffect } from 'react';
import { Outlet, Link, useLocation} from "react-router-dom";
import AppContext from "./components/AppContext";
import PaperCanvas from "./PaperCanvas";
import Toolbar from "./pages/Toolbar";


// TODO: set language dir in layout

const Layout = () => {
    const {GetLocaleString, GetLocaleDir, ForceResize} = useContext(AppContext);
    const location = useLocation();
    
    useEffect(() => {
        ForceResize ();
    }, [location]);

    return (
        <div className='AppContainer'>
            <div className="App" dir={GetLocaleDir()}>
                <div className='AppHeader'>
                    <div className="pure-menu pure-menu-horizontal menu_font" role={'presentation'} >
                        <nav>
                            <ul className="pure-menu-list">
                                <li className="pure-menu-item">
                                    <Link to="/" className="pure-menu-link">{GetLocaleString("menu.home")} </Link>
                                </li>

                                <li className="pure-menu-item">
                                    <Link to="/file" className="pure-menu-link">{GetLocaleString("menu.file")}</Link>
                                </li>

                                <li className="pure-menu-item">
                                    <Link to="/addsvg" className="pure-menu-link">{GetLocaleString("menu.svg")}</Link>
                                </li>
                                <li className="pure-menu-item">
                                    <Link to="/addtext" className="pure-menu-link">{GetLocaleString("menu.text")}</Link>
                                </li>
                                <li className="pure-menu-item">
                                    <Link to="/position" className="pure-menu-link">{GetLocaleString("menu.position")}</Link>
                                </li>
                                <li className="pure-menu-item">
                                    <Link to="/pattern" className="pure-menu-link">{GetLocaleString("menu.pattern")}</Link>
                                </li>
                                <li className="pure-menu-item">
                                    <Link to="/print" className="pure-menu-link">{GetLocaleString("menu.print")}</Link>
                                </li>
                                <li className="pure-menu-item">
                                    <Link to="/parameter" className="pure-menu-link">{GetLocaleString("menu.param")}</Link>
                                </li>
                                <li className="pure-menu-item">
                                    <Link to="/data" className="pure-menu-link">{GetLocaleString("menu.data")}</Link>
                                </li>
                            </ul>
                            {/*<button className="pure-menu-heading" onClick={() => {ForceResize()}}>FR</button>*/}

                        </nav>

                    </div>
                    <Toolbar />
                </div>
                
                <div className="App-Work">
                    <PaperCanvas Id="canvasid" />
                </div>    
                <div className="App-function">
                    <Outlet />
                </div>
                
                
            </div>
        </div>
    )
};

export default Layout;

