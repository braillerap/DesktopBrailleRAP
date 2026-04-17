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
 */

import './App.css';
import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './Layout';
import Home from './pages/Home';
import Data from './pages/Data';
import AddSVG from './pages/AddSVG';
import AddText from './pages/AddText';
import AddTextTag from './pages/AddTextTag';
import File from './pages/File';
import Position from './pages/Position';
import Patterns from './pages/Patterns';
import Print from './pages/Print';
import Parameter from './pages/Parameter';
import logo2 from './833.gif'
import libLouis from "./WrapLibLouisReact";
import AppOption from "./components/AppOption";
import AppContext from "./components/AppContext";


class App extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = (
      {
        louisloaded: false,
        webviewready: false,
        params:AppOption
      }
    );
    this.webviewloaded = this.webviewloaded.bind(this);
    this.LouisInit = this.LouisInit.bind(this);
    this.LouisLoaded = this.LouisLoaded.bind(this);
    this.GetLouis = this.GetLouis.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  
  GetLouis ()
  {
    return this.louis
  }

  handleResize ()
  {
    this.context.ForceResize ();
  }

  async LouisLoaded(success) {
    this.setState({ louisloaded: success });
    console.log ("Louis loaded => load backend");
    
    // set louis loglevel to LOG_OFF
    this.louis.lou_setLogLevel(60000);
    
    if (success)
    {
      // check braille table config consistency
      let tblnbr = this.louis.get_table_nbr();
      let fname = this.louis.get_table_fname(parseInt(this.context.Params.brailletbl));
      console.log ("Liblouis check ", 
          this.context.Params.brailletbl, " | ", 
          this.context.Params.louisfilecheck, " | ", 
          fname);
      if (this.context.Params.louisfilecheck !== fname) {
        // liblouis file change => need to go to parameters
        console.log ("Need Liblouis check");
        this.context.setNeedParamCheck (true);
        console.log ("Liblouis check set to", true);
      }
    }
    
    
  }
  LouisInit() {
    // initialize LibLouis
    this.louis = new libLouis();
    this.louis.load(this.LouisLoaded);
    
  }
  async webviewloaded() {
    //alert("webview loaded");
    //this.setState({ webviewready: true });
    window.pywebview.state = {};
    let option = await window.pywebview.api.get_parameters();
    console.log ("webviewloaded pywebview ready :", option);
    
    let runtime = await window.pywebview.api.get_runtime_options();
    console.log ("runtime option", runtime);

    let params = JSON.parse(option);
    let runparams = JSON.parse(runtime);

    this.setState({params:params});
    this.context.setParams (params);
    this.context.SetAppLocale (params.lang);
    this.context.setPyWebViewReady(true);
    this.context.GetBackend().setbackendready(true);
    this.context.SetRuntimeOptions (runparams);

    

    //let canv = this.context.GetPaperCanvas();
    
    this.context.ForceResize(); /* update page display according to parameters */
  }

  componentDidMount() {
    //this.LouisInit();
    window.addEventListener('pywebviewready', this.webviewloaded);
    //this.webviewloaded();
    window.addEventListener('resize', this.handleResize)
    this.LouisInit();
  }

  isPrintRequested ()
  {
    let runtime = this.context.GetRuntimeOptions();
    if (runtime.path_svg !== "" && runtime.path_patterns !== "")
    {
      return true;
    }
    return false;
  }
  render() {
    if (! this.state.louisloaded)
        return (
          <div className="App-loading">
          <div style={{height:"30%"}  }></div>
          <img src={logo2} alt="loading" />
        <h1>
          {this.context.GetLocaleString("app.loading")}
        </h1>
        
        </div>
        );
        
 
    //const isConditionPrint = !!process.env.REACT_APP_START_SVG;
    const isConditionPrint = this.isPrintRequested();
    return (
      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home  params={this.context.Params} />} />
              <Route path="/data" element={<Data />} />
              <Route path="/addsvg" element={<AddSVG />} />
              <Route path="/addtext" element={<AddTextTag />} />
              <Route path="/position" element={<Position />} />
              <Route path="/pattern" element={<Patterns />} />
              <Route path="/file" element={<File louis={this.louis} params={this.context.Params} />} />
              <Route path="/print" element={<Print louis={this.louis} params={this.context.Params} />} />
              <Route path="/parameter" element={<Parameter glouis={this.louis} params={this.context.Params} />} />
              <Route path="*"
                      element={
                        isConditionPrint ? (
                         <Print louis={this.louis} params={this.context.Params} />
                        ) : (
                          <Home params={this.context.Params} />
                  )
              }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      
    );
  }
}

export default App;
