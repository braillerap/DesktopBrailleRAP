/**
 * \file            PaperCanvasSelection.js
 * \brief           
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
import PaperCanvas from "./papercanvas.js"
import AppContext from './AppContext.js';
import paper from 'paper';
import mouseState from './mouseState.js';
import mouseMode from './mouseMode.js'
import patterns from '../patterns/patterns.js'


class PaperCanvasSelection
{
    constructor (papercanvas)
    {
        this.papercanvas = papercanvas;
        this.selecteditems = null;
        this.selection_node = null;
    }

    /*!
     *\brief Bring all item in selection to front (z order)
     *
     */ 
    bringToFront ()
    {
        if (this.selecteditems)
        {
            for (let item of this.selecteditems)
            {
                item.bringToFront ();
            }
            
        }
    }

    /*!
     *\brief Create the minimum rectangle including all items in selection
     *
     */
    createSelectionDisplay ()
    {
        if (this.selecteditems)
        {
            let rect = this.getBoundsRectangle ();

            if (this.selection_node)
            {
                this.selection_node.bounds = rect;
            }
            else
            {
                let item  = new this.papercanvas.paper.Path.Rectangle(
                        rect
                      );
                      item.strokeWidth = 1;
                      //item.dashArray = [4,10];
                      item.strokeColor = 'red';
                      item.fillColor = null;
                      item.scaling = 1;
                      item.strokeScaling = false;
                      item.locked = true;
                      item.name = "selection";
                this.selection_node = this.papercanvas.paper.project.activeLayer.addChild(item);
                console.log ("display selection :", this.selection_node);  
            }
        }
    }

    /*!
     *\brief Delete all items in selection from the paper canvas
     *
     */
    deletePaperItems ()
    {
        if (this.selecteditems)
        {
            for (let item of this.selecteditems)
            {
                item.remove ();
            }
            this.selecteditems = null;
        }
    }

    /*!
     *\brief Clear the current selection
     *
     */
    deselect ()
    {
        if (this.selecteditems)
        {
            for (let item of this.selecteditems)
                item.bounds.select = false;
        }
        this.selecteditems = null;
    }

    /*!
     *\brief Compute the minimum rectangle containing all items in selection
     *
     */
    getBoundsRectangle ()
    {

        if (this.selecteditems)
        {
            let bounds = null;
            if (Array.isArray (this.selecteditems))
            {
                // start with the bound rectangle of the first item
                bounds = new paper.Rectangle (this.selecteditems[0].bounds);
                if (this.selecteditems.length > 1)
                {
                    // add all next item in bounds
                    for (let i = 1; i < this.selecteditems.length; i++)
                        bounds = bounds.unite (this.selecteditems[i].bounds);
 
                }
                return bounds;
            }
        }
        return null;
    }

    /*!
     *\brief Return the selected item array
     *
     */
    getItems ()
    {
        return (this.selecteditems);
    }

    /*!
     *\brief Hide the selection
     *
     */
    hideSelection ()
    {
        if (this.selecteditems)
        {
            for (let item of this.selecteditems)
            {
                item.bounds.selected = false;
            }
        }

        if (this.selection_node)
        {
            this.selection_node.remove ();
            this.selection_node = null;
        }

    }

    /*!
     *\brief Test if a point is contain in the selection rectangle
     *
     *\param pt the point to test
     * 
     *\return true, if the point is contain in selection rectangle, otherwise false.
     */
    hitTest (pt)
    {
        if (this.selection_node)
        {
            if (this.selection_node.contains (pt))
                return (true);
        }
        return (false);
    }

    /*!
     *\brief Test there is items in selection
     *
     *\return true is 1 item or more are in selection. Otherwise false
     */
    isCurrentSelection ()
    {
        if (this.selecteditems)
            return (true);
        return (false);
    }
    setItems(items)
    {
        this.hideSelection (); // hide previous selection if it exist
        this.selecteditems = items;
        
    }

    setAbsolutePosition (x,y)
    {
        console.log ("tbd");
    }
    
    
    
    offsetPosition (x,y)
    {
        if (this.selecteditems)
        {
            for (let item of this.selecteditems)
            {
                item.position.x = item.position.x + x;
                item.position.y = item.position.y + y;
            }
            
        }
    }

    sendToBack ()
    {
        if (this.selecteditems)
        {
            for (let item of this.selecteditems)
            {
                item.sendToBack ();
            }
            
        }
    }
    updateSelectionDisplay ()
    {
        if (this.selection_node)
        {
            let rect = this.getBoundsRectangle ();
            this.selection_node.bounds = rect;
        }
    }

}
export default PaperCanvasSelection;