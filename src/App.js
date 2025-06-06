import './App.css';
import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './Layout';
import Home from './pages/Home';
import Data from './pages/Data';
import AddSVG from './pages/AddSVG';
import AddText from './pages/AddText';
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
    //this.webviewloaded();
    
    
    
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
    console.log ("pywebview ready :");
    console.log (option);
    let runtime = await window.pywebview.api.get_runtime_options();
    console.log (runtime);

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
          Chargement...
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
              <Route path="/addtext" element={<AddText />} />
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
