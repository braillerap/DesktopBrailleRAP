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
  }

  LouisLoaded(success) {
    this.setState({ louisloaded: success });
    //this.webviewloaded();
    
  }
  GetLouis ()
  {
    return this.louis
  }


  async LouisInit() {
    // initialize LibLouis
    this.louis = new libLouis();
    this.louis.load(this.LouisLoaded);
    
  }
  async webviewloaded() {
    //alert("webview loaded");
    //this.setState({ webviewready: true });
    window.pywebview.state = {};
    let option = await window.pywebview.api.gcode_get_parameters();
    console.log ("pywebview ready :");
    console.log (option);
    let params = JSON.parse(option);
    this.setState({params:params});
    this.context.setParams (params);
    this.context.SetAppLocale (params.lang);
    this.context.setPyWebViewReady(true);
    this.context.GetBackend().setbackendready(true);
  }

  async componentDidMount() {
    this.LouisInit();
    window.addEventListener('pywebviewready', this.webviewloaded);
    //this.webviewloaded();
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
    return (
      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home  params={this.context.Params} />} />
              <Route path="/data" element={<Data />} />
              <Route path="/addsvg" element={<AddSVG />} />
              <Route path="/addtext" element={<AddText />} />
              <Route path="/position" element={<Position />} />
              <Route path="/file" element={<File louis={this.louis} params={this.context.Params} />} />
              <Route path="/print" element={<Print louis={this.louis} params={this.context.Params} />} />
              <Route path="/parameter" element={<Parameter glouis={this.louis} params={this.context.Params} />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      
    );
  }
}

export default App;
