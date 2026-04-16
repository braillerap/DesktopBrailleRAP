/**
 * \file            layout.js
 * \brief           Define the application display layout
 */

/*
 *
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS LICENSED UNDER
 *                  GNU GENERAL PUBLIC LICENSE
 *                   Version 3, 29 June 2007
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * This file is part of DesktopBrailleRAP software.
 *
 * SPDX-FileCopyrightText: 2025-2026 Stephane GODIN <stephane@braillerap.org>
 */

import { useContext, useEffect } from 'react';
import { Outlet, Link, useLocation} from "react-router-dom";
import AppContext from "./components/AppContext";
import PaperCanvas from "./PaperCanvas";
import Toolbar from "./pages/Toolbar";
import MainArea from './components/mainarea';

// TODO: set language dir in layout

const Layout = () => {
    const {GetLocaleString, GetLocaleDir, ForceResize, NeedParamCheck} = useContext(AppContext);
    const location = useLocation();
    
    useEffect(() => {
        ForceResize ();
    }, [location]);
    
    const exitrequest = (e) => {
        
        e.preventDefault();
        window.pywebview.api.confirm_dialog("DesktopBrailleRAP", GetLocaleString("app.confirquit")).then ((ret) => {
            if (ret === true)
                window.pywebview.api.quit();
        });
        

    }
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
                                <li className="pure-menu-item">
                                    <Link onClick={exitrequest} className="pure-menu-link">
                                        {GetLocaleString("menu.exit")} 
                                    </Link>
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

