import './App.css';
import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from './Layout';
import Home from './Home';
import Data from './Data';
import AddSVG from './AddSVG';
import AddText from './AddText';
import Position from './Position';
import Print from './Print';
import logo2 from './833.gif'
import libLouis from "./WrapLibLouisReact";

import AppContextWrapper from './AppContextWrapper';


class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = (
      {
        louisloaded: false,
        webviewready: false
      }
    );
    this.webviewloaded = this.webviewloaded.bind(this);
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
  async webviewloaded() {
    this.louis = new libLouis();
    this.louis.load(this.LouisLoaded);
    
  }

  async componentDidMount() {
    //window.addEventListener('pywebviewready', this.webviewloaded);
    this.webviewloaded();
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
      <AppContextWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/data" element={<Data />} />
              <Route path="/addsvg" element={<AddSVG />} />
              <Route path="/addtext" element={<AddText />} />
              <Route path="/position" element={<Position />} />
              <Route path="/print" element={<Print louis={this.louis} />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextWrapper>
    );
  }
}

export default App;
