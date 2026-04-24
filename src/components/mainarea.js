/**
 * \file            app.js
 * \brief           Main entry 
 */

/*
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
 * SPDX-License-Identifier: GPL-3.0 
 */

import { useContext} from 'react';
import AppContext from "./AppContext";
import { Outlet, Link, useLocation} from "react-router-dom";
import PaperCanvas from "../PaperCanvas";

const MainArea = () => {
    const {NeedParamCheck} = useContext(AppContext);

    const handleClickParam = () => {
        //if (this.props.focuscb)
        //    this.props.focuscb();
    }

    
    
    if (NeedParamCheck)
    {
        return (
            
        <div>

          <h1 aria-label='Formulaire de saisie du texte'>

          </h1>
          <ul className={this.context.getStyleClass('menu')}>
            <li >
              <Link to="/parametre" 
                onClick={this.handleClickParam}
                ref={this.props.focusref}
              >
                Braille transcription table is not consistent, please check parameters
              </Link>
               <Link to="/parametre" 
                onClick={handleClickParam}
                
              >
                Paramètres
              </Link>
            </li>
          </ul>

        </div>
      );
        
    }
    
    
    return (
        <>
            

                <div className="App-Work">
                    <PaperCanvas Id="canvasid" />
                </div>    
                <div className="App-function">
                    <Outlet />
                </div>
        </>
    );
};

export default MainArea;