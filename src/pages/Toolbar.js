/**
 * \file            Toolbar.js
 * \brief           Application toolbar
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
import { useContext } from 'react';
import { FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEraser } from "react-icons/fa6";
import { FaArrowUpWideShort } from "react-icons/fa6";
import { FaArrowDownShortWide } from "react-icons/fa6";
import mouseMode from '../mouseMode';
import AppContext from "../components/AppContext";


const Toolbar = () => {
    const {MouseMode, setMouseMode,GetPaperCanvas, GetLocaleString, GetBackend} = useContext(AppContext);

    let classrotate = MouseMode === mouseMode.ROTATE ? "toolbar_active" : "";
    let classmove = MouseMode === mouseMode.MOVE ? "toolbar_active" : "";
    let classscale = MouseMode === mouseMode.SCALE ? "toolbar_active" : "";
    
    
    // 
    // set mode to positioning
    //
    const handleSetMove = () => {
        let canv = GetPaperCanvas ();
        if (canv)
        {
          setMouseMode(mouseMode.MOVE);
          canv.setMouseMode(mouseMode.MOVE);
        }
    }
    // 
    // set mode to rotate
    //
    const handleSetRotate = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        setMouseMode(mouseMode.ROTATE);
        canv.setMouseMode(mouseMode.ROTATE);
      }
    }

    // 
    // set mode to rotate
    //
    const handleSetScale = () => {
      
      let canv = GetPaperCanvas ();
      if (canv)
      {
        setMouseMode(mouseMode.SCALE);
        canv.setMouseMode(mouseMode.SCALE);
      }
    }
    //
    // delete selected object
    //
    const handleDelete = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedDelete ();
      }
    }

    // 
    // clear the project
    //
    const handleDeleteAll = async () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        if (GetBackend().isbackendready())
        {
          let test = await GetBackend ().confirm_dialog ("DesktopBrailleRAP", GetLocaleString("toolbar.confirm.deleteall"));
          console.log (test);
          if (test === true)
          {
            canv.DeleteAll ();
          }  
        }
        else if (window.confirm(GetLocaleString("toolbar.confirm.deleteall")) === true) 
        {
          canv.DeleteAll ();
        }
      }
    }
    //
    // move selected object up in Z order
    //
    const handleUp = () => {
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedUp ();
      }
    }
    //
    // move selected object down in Z order
    //
    const handleDown = () => {
      
      let canv = GetPaperCanvas ();
      if (canv)
      {
        canv.SelectedDown ();
      }
    }

    return (
    <>
        <div className="toolbar">
            
            <button className ="pure-button " onClick={handleSetMove}>
            <FaArrowsUpDownLeftRight className={classmove}/>
            </button>

            <button className ="pure-button " onClick={handleSetRotate}>
              <FaArrowRotateRight className={classrotate}/>
            </button>

            <button className ="pure-button " onClick={handleSetScale}>
              <FaArrowUpRightFromSquare className={classscale}/>
            </button>
            &nbsp;
            
            <button className ="pure-button " onClick={handleDelete}>
            <FaEraser />
            
            
            </button>
            &nbsp;
            <button className ="pure-button " onClick={handleDeleteAll}>
            <FaRegTrashCan />
            
            </button>
            &nbsp;
            <button className ="pure-button " onClick={handleUp}>
            <FaArrowUpWideShort />
            
            </button>
            <button className ="pure-button " onClick={handleDown}>
            <FaArrowDownShortWide />
            
            </button>

        </div>

    </>
    );
  };
  
  export default Toolbar;