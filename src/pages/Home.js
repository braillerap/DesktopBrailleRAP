/**
 * \file            home.js
 * \brief           Home application form
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

import React from 'react';
import AppContext from "../components/AppContext";
import { Link} from "react-router-dom";
import { FaWrench } from "react-icons/fa6";

class Home extends React.Component {
  static contextType = AppContext;
  
  constructor(props) {
    super(props);
    this.state = {
      falsestateforwarning: false
    };
    this.handleClickparam = this.handleClickparam.bind(this);
  }

  componentDidMount() {
    if (this.props.params) {
      console.log("setting up params")
      this.context.setParams(this.props.params);
    }
    
    //if (this.props.webviewready)
    //  this.context.setPyWebViewReady(this.props.webviewready);
    this.context.ForceResize ();    
  }

  handleClickparam ()
  {
    console.log ("click go to param");
  }

  render() {
    if (this.context.NeedParamCheck)
    {
      return (
                  
              <div>
      
                
                <Link className="HiddenLink" to="/parameter" onClick={this.handleClickParam}>
                <h2 className="WarningTitle"><FaWrench /> {this.context.GetLocaleString("param.checkliblouis")}</h2>
                </Link>
                <Link to="/parameter" 
                      onClick={this.handleClickParam}
                    >
                      {this.context.GetLocaleString ("menu.param")}
                </Link>
                
              </div>
            );
    }
    return (
      <>
        <div className="Home">
          
          <a href="https://www.braillerap.org" target="_blank" rel="noreferrer">
            <img src="./braillerap_logo.svg" width='25%' alt="BrailleRAP logo"  />
          </a>
          <h1>DesktopBrailleRAP</h1>
          <h2>Version:{`${process.env.REACT_APP_VERSION}`}</h2>

         
          <a href="https://www.nlnet.nl" target="_blank" rel="noreferrer">
            <img src="./logo-sh.svg" width='25%' alt="NLnet foundation logo"  />
          </a>
          
        </div>
      </>

    );
  }
};

export default Home;