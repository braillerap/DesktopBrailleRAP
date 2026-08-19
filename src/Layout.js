/**
 * \file            layout.js
 * \brief           Define the application display layout
 */

/*
 * GNU GENERAL PUBLIC LICENSE
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
 * 
 * SPDX-License-Identifier: GPL-3.0 
 */
    
import { useContext, useEffect, useState } from 'react';
import { Outlet, Link, useLocation} from "react-router-dom";
import AppContext from "./components/AppContext";
import PaperCanvas from "./components/PaperCanvas";
import Toolbar from "./pages/Toolbar";

// TODO: set language dir in layout

const Layout = () => {
    const {GetLocaleString, GetLocaleDir, ForceResize, GetBackend} = useContext(AppContext);
    const location = useLocation();
    const theme = useState('normal');
    useEffect(() => {
        ForceResize ();
    }, [location, ForceResize]);
    
    const exitrequest = (e) => {
        
        e.preventDefault();
        GetBackend ().confirm_dialog("DesktopBrailleRAP", GetLocaleString("app.confirquit")).then ((ret) => {
            if (ret === true)
                GetBackend ().api.quit();
        });
        

    }
    return (
        <div className='normal AppContain'>
            <div className="grid grid-rows-[6rem_55rem_1rem] grid-cols-[1fr_1fr]  box-border border-0" dir={GetLocaleDir()}>
                <div className='row-start-1 row-end-2 col-span-2 box-border overflow-clip ' >
                    <div className="" role={'presentation'} >
                        <nav>
                            <ul className="flex justify-start gap-2">
                                <li className="relative">
                                    <Link to="/" className="MenuLink">{GetLocaleString("menu.home")} </Link>
                                </li>

                                <li className="relative">
                                    <Link to="/file" className="MenuLink">{GetLocaleString("menu.file")}</Link>
                                </li>

                                <li className="relative">
                                    <Link to="/addsvg" className="MenuLink">{GetLocaleString("menu.svg")}</Link>
                                </li>
                                <li className="relative">
                                    <Link to="/addtext" className="MenuLink">{GetLocaleString("menu.text")}</Link>
                                </li>
                                <li className="relative">
                                    <Link to="/position" className="MenuLink">{GetLocaleString("menu.position")}</Link>
                                </li>
                                <li className="relative">
                                    <Link to="/pattern" className="MenuLink">{GetLocaleString("menu.pattern")}</Link>
                                </li>
                                <li className="relative">
                                    <Link to="/print" className="MenuLink">{GetLocaleString("menu.print")}</Link>
                                </li>
                                <li className="relative">
                                    <Link to="/parameter" className="MenuLink">{GetLocaleString("menu.param")}</Link>
                                </li>
                                <li className="relative">
                                    <Link to="/data" className="MenuLink">{GetLocaleString("menu.data")}</Link>
                                </li>
                                <li className="relative">
                                    <Link onClick={exitrequest} className="MenuLink">
                                        {GetLocaleString("menu.exit")} 
                                    </Link>
                                </li>
                            </ul>
                            
                            
                        </nav>

                    </div>
                    
                    <Toolbar />
                    
                </div>
                
                 <div className="col-start-1 col-end-2 row-start-2 row-end-3 overflow-clip relative ">
                    <PaperCanvas Id="canvasid" /> 
                    
                </div>    
                <div className="col-start-2 col-end-3 row-start-2 row-end-3 mx-2 overflow-x-clip overflow-y-scroll relative">
                    <Outlet />
                    
                </div>
                <div className="col-start-1 col-end-3 row-start-3 row-end-4 overflow-clip relative">
                    <p>&nbsp;</p> {/* space for futur message */}
                    
                </div>
                
            </div>
        </div>
    )
};

export default Layout;

