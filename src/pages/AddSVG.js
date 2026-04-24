/**
 * \file            AddSVG.js
 * \brief           Add svg application form
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


class AddSVG extends React.Component {
    static contextType = AppContext;  

    constructor(props) {
      super(props);
      this.state = {
          file: null,
      }
      
      this.handleLoad = this.handleLoad.bind(this);
      this.handleFileChange = this.handleFileChange.bind(this);
    }
    async componentDidMount() {
      // TODO get backend from context not prop
   
      this.context.ForceResize ();
    }
    /*
  const [file, setFile] = useState();
  const { GetImportSVG, GetPaperCanvas, GetLocaleString, PyWebViewReady, ForceResize} = useContext(AppContext);
*/
  async handleLoad (e) {
    e.stopPropagation();

    let canv = this.context.GetPaperCanvas();
    if (canv && this.context.PyWebViewReady) {
      e.preventDefault();

      let dialogtitle = this.context.GetLocaleString ("svg.open"); //"Ouvrir"
      let filter = [
        this.context.GetLocaleString ("file.svgfile"), //"Fichier SVG",
        this.context.GetLocaleString ("file.all"), //"Tous"
      ]
      let types = [
        "(*.svg)",
        "(*.*)"
      ]

      let ret = await window.pywebview.api.import_file(dialogtitle, filter, types);
      //console.log(ret);
      if (ret.length > 0) {
        let data = JSON.parse(ret);
        console.log ("data.fname " + data.fname);
        canv.importSvg(data.data, data.fname);
      }
    }
  }

  handleFileChange  (e)  
  {
    if (e.target.files) {
      this.setState({file: e.target.files[0]});
      let f = this.context.GetImportSVG();
      let p = this.context.GetPaperCanvas();
      
      //console.log("svg import:" + f);
      if (p)
      {
        p.importSvg(e.target.files[0]);
      }
      else if (f) {
        f(e.target.files[0]);
      }
    }
  };
  
  
  render ()
  {
    return (
      <>
        <h1>{this.context.GetLocaleString("svg.import")}</h1>
        
        <div>
          {this.context.PyWebViewReady === false &&
            <>
              <p>backend mock</p>
              <input type="file" onChange={this.handleFileChange} className='pure-button' accept={"image/svg+xml"} />
              <div>
                {this.state.file && `${this.state.file.name} - ${this.state.file.type} - ${this.state.file}`}
              </div>
            </>
          }
          
          <button onClick={this.handleLoad} className={`pure-button `}>{this.context.GetLocaleString("svg.importfile")}...</button>
          
        </div>
      </>
    );
  }
};

export default AddSVG;