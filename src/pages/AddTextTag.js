/**
 * \file            AddTextTag.js
 * \brief           Add text application form
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



let key = 0;
class InputTextTag extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      Message: "xxx"
    };

    this.altcode = ""; // unicode key value for alternate input with control

    this.handleClickButton = this.handleClickButton.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount ()
  {
    console.log ("didmount field");
    this.setState({Message:this.props.initialvalue});
    this.context.GetPaperCanvas().RegisterSelectedChangeCallback(this.onSelectChange)

    let str = this.context.GetLocaleString("text.defaulttag");
    if (this.context.Selected)
    {
      if (this.context.Selected.className === 'PointText')
      {
        str = this.context.Selected.content;
      }
    }
    this.setState ({Message:str});
  }
  componentWillUnmount ()
  {
    this.context.GetPaperCanvas().UnRegisterSelectedChangeCallback(this.onSelectChange)
  }

  onSelectChange (svgnode)
  {
    console.log("canvas say select change", svgnode);
    
    // check if the selected paperjs node is text
    if (svgnode && svgnode.className === "PointText")
    {
      this.setState({Message:svgnode.content});
    }
    else
    {
      // set the default new tag title
      this.setState({Message:this.context.GetLocaleString("text.defaulttag")});
    }
  }

  handleKeyDown(event) {
    const hexachar = '0123456789abcdef';
    const braillechar = '12345678';
    const digitchar = '0123456789';

    if (event.ctrlKey === true) {
      if (this.altcode.length > 0) {
        if (this.altcode === '0') {
          console.log("key", event.key);
          // check for hexa value starting with "0x"
          if ((digitchar.indexOf(event.key) >= 0) ||
            (event.key === 'x' || event.key === 'X') ||
            (event.key === 'b' || event.key === 'B')
          ) {
            this.altcode += event.key; // build unicode key value
            event.preventDefault();
          }
          else {
            this.altcode = ""; // reset character code value
          }
        }
        else {
          if (this.altcode.startsWith('0x')) {
            if (hexachar.indexOf(event.key) >= 0) {
              this.altcode += event.key; // build unicode hex value
              event.preventDefault();
            }

          }
          else if (this.altcode.startsWith('0b')) {
            if (braillechar.indexOf(event.key) >= 0) {
              this.altcode += event.key; // build braille dots values
              event.preventDefault();
            }
          }
          else if (digitchar.indexOf(event.key) >= 0) {
            this.altcode += event.key; // build unicode value
            event.preventDefault();
          }
          else {
            this.altcode = ""; // reset character code value
          }
        }
      }
      // check for decimal value
      else if (event.key >= '0' && event.key <= '9') {
        this.altcode += event.key; // build unicode key value
        event.preventDefault();
      }
      else {
        this.altcode = ""; // reset character code value
      }
    }
  }

  handleKeyUp(event) {
    if (event.key === "Control") {
      console.log ("analyze:", this.altcode);
      if (this.altcode.length > 0) {
        let char = '';
        let val = 0;
        if (this.altcode.startsWith('0b') || this.altcode.startsWith('0B')) {
          let brval = 0x2800;

          for (let i = 2; i < this.altcode.length; i++) {

            let dot = parseInt(this.altcode[i]);
            if (dot > 0 && dot < 9) {
              let dothex = 1 << (dot - 1);
              console.log('hex', dothex, dot);
              brval = brval | dothex;
            }
          }
          char = String.fromCharCode([brval]);

        }
        else {
          if (this.altcode.startsWith('0x') || this.altcode.startsWith('0X'))
            val = parseInt(this.altcode, 16); // convert hexavalue
          else
            val = parseInt(this.altcode); // convert decimal value

          if (val < 0)
            val = 0;

          if (val > 255) {
            char = String.fromCharCode([val]); // get complete unicode value
          }
          else {
            char = String.fromCharCode([0x2800 + val]); // consider value as offset in Braille table
          }

        }
        this.altcode = ""; // forget previous code value
        
        
        let ntxt = this.state.Message + char;
        
        this.setState({ Message: ntxt });
        //this.props.textcb(ntxt);
        event.preventDefault();
      }
    }

  }

  handleClickButton() {
    if (this.props.callback)
      this.props.callback(this.state.Message);
  }

  render() {
    return (
      <>
        
        <input type="text" value={this.state.Message}
          onChange={(e) => this.setState({ Message: e.target.value })}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          key={this.props.vkey}
          id={this.props.id} />
        <p>&nbsp;</p>
        {/*<p>Initialvalue :{this.props.initialvalue}</p>*/}
        {/*<p>State.Message: {this.state.Message} </p>*/}
        <button onClick={this.handleClickButton} className='pure-button'>
          {this.props.label}
        </button>
      </>
    );
  }
}

class AddTextTag extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      Message: "Nouveau"
    };
    this.handleAddButton = this.handleAddButton.bind(this);
    this.handleUpdateButton = this.handleUpdateButton.bind(this);
    this.onSelectChange = this.onSelectChange.bind (this);
  }

  componentDidMount ()
  {
    console.log ("didmount page");
    this.context.GetPaperCanvas().RegisterSelectedChangeCallback(this.onSelectChange)
  
    let str = this.context.GetLocaleString("text.defaulttag");
    if (this.context.Selected)
    {
      if (this.context.Selected.className === 'PointText')
      {
        str = this.context.Selected.content;
      }
    }
    this.setState ({Message:str});
    
  }

  componentWillUnmount ()
  {
    this.context.GetPaperCanvas().UnRegisterSelectedChangeCallback(this.onSelectChange)
  }

  onSelectChange (svgnode)
  {
    console.log("canvas say select change", svgnode);
    //let selected = this.context.Selected;
    
    if (svgnode )
    {
      if (svgnode.className === "PointText")
        this.setState({Message:svgnode.content});
      else
        this.setState({Message:this.context.GetLocaleString("text.defaulttag")});
    }
    else
    {
      console.log ("set nouveau");
      this.setState({Message:this.context.GetLocaleString("text.defaulttag")});
    }
  }
  
  handleAddButton(val) {

    let p = this.context.GetPaperCanvas();

    if (p) {

      p.addTxt(val);
    }

  }
  handleUpdateButton(val) {

    if (this.context.Selected) {
      if (this.context.Selected.className === 'PointText') {
        this.context.Selected.content = val;
      }
    }
  }
  render() {
    
    key = key + 1;
  
    let selected = this.context.Selected;

    if (selected && selected.className === "PointText") {
      return (
        <>
          <h3>{this.context.GetLocaleString("text.update")}</h3>
          <div>
            <InputTextTag
              initialvalue={this.state.Message}
              callback={this.handleUpdateButton}
              label={this.context.GetLocaleString("text.updatebtn")}
              vkey={key} />
          </div>
        </>
      );
    }
  
    return (
      <>
        <h3>{this.context.GetLocaleString("text.add")}</h3>

        <div>
          <InputTextTag
            initialvalue={this.state.Message}
            callback={this.handleAddButton}
            label={this.context.GetLocaleString("text.addbtn")}
            vkey={key}
            id='TextInput' />
        </div>
      </>
    );
  }
};

export default AddTextTag;