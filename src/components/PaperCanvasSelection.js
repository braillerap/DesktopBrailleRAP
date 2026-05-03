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
                item.dashArray = [8,10];
                item.strokeColor = 'red';
                item.fillColor = null;
                item.scaling = 1;
                item.strokeScaling = false;
                item.locked = true;
                item.name = "selection";
                item.applyMatrix = false;
                item.bounds.selected = false;
                item.pivot = [0, 0];
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
     *\brief return the selection position as an array [x,y]
     *
     *\return if the selection exist return top left corner of the selection rectangle 
     * as an array [x,y]. Return null if there is no selection.
     */
    getSelectionPositionArray()
    {
        if (! this.selecteditems)
            return null;
        if (this.selecteditems.length === 1)
        {
            return ([this.selecteditems[0].position.x, this.selecteditems[0].position.y]);
        }
        else if (this.selecteditems.length > 1)
        {
            let rect = this.getBoundsRectangle ();
            return ([rect.x, rect.y]);

        }
        return (null);
    }

    /*!
     *\brief return the selection size as an array [width,height]
     *
     *\return if the selection exist return width and height of the selection rectangle 
     * as an array [width,height]. Return null if there is no selection.
     */
    getSelectionSizeArray()
    {
        if (! this.selecteditems)
            return null;
        if (this.selecteditems.length === 1)
        {
            return ([this.selecteditems[0].bounds.width, this.selecteditems[0].bounds.height]);
        }
        else if (this.selecteditems.length > 1)
        {
            let rect = this.getBoundsRectangle ();
            return ([rect.width, rect.height]);

        }
        return (null);
    }
     /*!
     *\brief return the paperjs classname of the selection 
     *
     *\return if only one item is selected, the function return the paperjs classname.
     * otherwise and empty string or '*' to show multiple selection.
     */
    getSelectionClassname ()
    {
        if (! this.selecteditems)
            return '';
        if (this.selecteditems.length === 1)
        {
            return (this.selecteditems[0].className);
        }
        else if (this.selecteditems.length > 1)
        {
            return ('*');
        }
        return ('');
    }

    /*!
     *\brief return the paperjs content of the selection 
     *
     *\return if only one item is selected, the function return the paperjs content.
     * otherwise and empty string or '*' to show multiple selection.
     */
    getSelectionContentText ()
    {
        if (! this.selecteditems)
            return '';
        if (this.selecteditems.length > 1)
        {
            return ('*');
        }
        if (this.selecteditems.length === 1)
        {
            if (this.selecteditems[0].content)
                return (this.selecteditems[0].content);
        }
        
        return ('');
    }

    /*!
     *\brief Return the number of item in selection
     *
     *\return 0 or selection item number
     */
    getSelectionCount ()
    {
        if (this.selecteditems)
            return (this.selecteditems.length);
        return (0);
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

    /*!
     *\brief set the content text of a all selection item
     *
     */
    setItems(items)
    {
        this.hideSelection (); // hide previous selection if it exist
        this.selecteditems = items;
        
    }

    /*!
     *\brief set the absolute position of the selection
     *
     */
    setAbsolutePosition (x,y)
    {
        if (x === undefined || y === undefined)
            return;
        if (this.selecteditems)
        {
            if (this.selecteditems.length === 1)
            {
                console.log ("update position destination", x, y);
                this.selecteditems[0].position.x = x;
                this.selecteditems[0].position.y = y;
                console.log ("position item ", this.selecteditems[0].bounds.x, this.selecteditems[0].bounds.y, this.selecteditems[0]);
            }

            if (this.selecteditems.length > 1)
            {
                let deltax = x - this.selection_node.bounds.x;
                let deltay = y - this.selection_node.bounds.y;
                
                if (Math.abs(deltax) < 0.01)
                    deltax = 0.0;

                if (Math.abs(deltay) < 0.01)
                    deltay = 0.0;    
                
                // update position of selected items
                console.log ("update rect source", this.selection_node.bounds.x, this.selection_node.bounds.y, this.selection_node);
                console.log ("update position delta", deltax, deltay);
                console.log ("update position destination", x, y);

                for (let item of this.selecteditems)
                {
                    console.log ("update position source", item.position.x, item.position.y);
                    item.position.x = item.position.x + deltax;
                    item.position.y = item.position.y + deltay;
                    console.log ("update position dest", item.position.x, item.position.y);
                }
                
                // update position of selection rectangle
                console.log ("update selection node", x, y);
                this.selection_node.bounds.x = x;
                this.selection_node.bounds.y = y;
                
                console.log ("updated selection node", this.selection_node.bounds.x, this.selection_node.bounds.y);
            }
            this.updateSelectionDisplay();
        }
    }
    
    setContentText (text)
    {
        if (! this.selecteditems)
            return;
        for (let item of this.selecteditems)
        {
            
            item.content = text;
            
        }
        this.updateSelectionDisplay();
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

    relative_rotate(startpt, endpt) {
        if (this.selecteditems) {
            let rotation_point = new this.papercanvas.paper.Point(0, 0);
            let v1 = new this.papercanvas.paper.Point(0, 0);
            let v2 = new this.papercanvas.paper.Point(0, 0);

            if (this.selecteditems.length === 1) {
                if (this.selecteditems[0].className !== "PointText") {
                    rotation_point.x = this.selecteditems[0].bounds.center.x;
                    rotation_point.y = this.selecteditems[0].bounds.center.y;
                }
                else {
                    rotation_point.x = this.selecteditems[0].position.x;
                    rotation_point.y = this.selecteditems[0].position.y;
                }

                v1.x = startpt.x - rotation_point.x;
                v1.y = startpt.y - rotation_point.y;
                v2.x = endpt.x - rotation_point.x;
                v2.y = endpt.y - rotation_point.y;

                this.selecteditems[0].rotate(v2.angle - v1.angle, rotation_point);
            }
            if (this.selecteditems.length > 1 && this.selection_node) {
                rotation_point = this.selection_node.bounds.center;

                v1.x = startpt.x - rotation_point.x;
                v1.y = startpt.y - rotation_point.y;
                v2.x = endpt.x - rotation_point.x;
                v2.y = endpt.y - rotation_point.y;


                for (let item of this.selecteditems) {
                    item.rotate(v2.angle - v1.angle, rotation_point);
                }
            }

            this.updateSelectionDisplay();
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