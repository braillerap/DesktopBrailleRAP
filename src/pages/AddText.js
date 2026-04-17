/**
 * \file            AddText.js
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

import { useState, useContext } from 'react';
import AppContext from "../components/AppContext";



let key = 0;

const InputText = (props) => {
  const [Message, setMessage] = useState(props.initialvalue);
  const handleClickButton = () => {
    if (props.callback)
      props.callback(Message);
  }

  return (
    <>

      <input type="text" defaultValue={props.initialvalue} onChange={(e) => setMessage(e.target.value)} key={props.vkey} id={props.id} />
      <p>&nbsp;</p>
      {/*<p>{props.initialvalue}</p>*/}
      {/*<p>{Message} {props.vkey}</p>*/}
      <button onClick={handleClickButton} className='pure-button'>
        {props.label}
      </button>
    </>
  );
}

const AddText = () => {
  const {GetPaperCanvas, Selected, GetLocaleString } = useContext(AppContext);
  const [NewMessage, setNewMessage] = useState('Nouveau');

  const handleAddButton = (val) => {
    
    let p = GetPaperCanvas();
    console.log ("Add text");
    if (p) {
      console.log ("add text via direct call");
      p.addTxt(val);
    }
    
  }
  const handleEditButton = (val) => {
    if (Selected) {
      if (Selected.className === 'PointText') {
        Selected.content = val;
      }
    }
  }
  let f = GetPaperCanvas();
  key = key + 1;
  if (f) {
    let selected = Selected;

    if (selected && selected.className === "PointText") {


      return (
        <>
          <h3>{GetLocaleString("text.update")}</h3>
          <div>
            <InputText
              initialvalue={Selected.content}
              callback={handleEditButton}
              label={GetLocaleString("text.updatebtn")}
              vkey={key} />
          </div>
        </>
      );
    }
  }
  return (
    <>
      <h1>{GetLocaleString("text.add")}</h1>

      <div>
        <InputText
          initialvalue={NewMessage}
          callback={handleAddButton}
          label={GetLocaleString("text.addbtn")}
          vkey={key}
          id='TextInput' />
      </div>
    </>
  );
};

export default AddText;