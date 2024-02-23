import './App.css';
import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './Layout';
import Home from './Home';
import Data from './Data';
import AddSVG from './AddSVG';
import AddText from './AddText';
import File from './File';
import Position from './Position';
import Print from './Print';
import Parameter from './Parameter';
import logo2 from './833.gif'
import libLouis from "./WrapLibLouisReact";
import AppOption from "./AppOption";
import AppContext from "./AppContext";

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
    this.setState({ webviewready: true });
    window.pywebview.state = {};
    let option = await window.pywebview.api.gcode_get_parameters();
    console.log (option);
    let params = JSON.parse(option);
    this.setState({params:params});
    this.context.setParams (params);
    
  }

  async componentDidMount() {
    this.LouisInit();
    window.addEventListener('pywebviewready', this.webviewloaded);
    
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
              <Route index element={<Home  params={this.context.Params} webviewready={this.state.webviewready}/>} />
              <Route path="/data" element={<Data />} />
              <Route path="/addsvg" element={<AddSVG />} />
              <Route path="/addtext" element={<AddText />} />
              <Route path="/position" element={<Position />} />
              <Route path="/file" element={<File louis={this.louis} params={this.context.Params} webviewready={this.state.webviewready}/>} />
              <Route path="/print" element={<Print louis={this.louis} params={this.context.Params} webviewready={this.state.webviewready}/>} />
              <Route path="/parameter" element={<Parameter glouis={this.louis} params={this.context.Params} webviewready={this.state.webviewready}/>} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      
    );
  }
}

export default App;
