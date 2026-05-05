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


import paper from 'paper';


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
            // refresh selection display
            for (let item of this.selecteditems)
            {
                item.bounds.selected = true;
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
     *\brief Return the angle of the selection
     *
     */
    getSelectionAngle ()
    {
        if (! this.selecteditems)
            return (0);
            
        if (this.selecteditems.length > 0)
        {
            if (this.selecteditems[0].children)
            {
                return (this.selecteditems[0].children[0].rotation);    
            }
            
            return (this.selecteditems[0].rotation);
        }
        
        return (0);
    }
    /*!
     *\brief Return the scale of the selection
     *
     */
    getSelectionScale ()
    {
        if (! this.selecteditems)
            return (1);
        
        for (let i = 0; i < this.selecteditems.length; i++)
        {
        
            if (this.selecteditems[i].className !== 'PointText')
            {
                if (this.selecteditems[i].children)
                    return (this.selecteditems[i].children[0].scaling.x);
            }
        }

        return (1);
    }
    /*!
     *\brief Return the scale of the selection in percent
     *
     */
    getSelectionScalePercent ()
    {
        if (! this.selecteditems)
            return (100);
            
        for (let i = 0; i < this.selecteditems.length; i++)
        {
            // get the first item that is not Braille
            if (this.selecteditems[i].className !== 'PointText')
            {
                if (this.selecteditems[i].children)
                    // return the scale of the first children of top element (paperjs !!!)
                    return (this.selecteditems[i].children[0].scaling.x * 100);
            }
        }

        return (100);
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
     *\brief Return the top left position of the selection rectangle
     *
     *\return A paper point with the top left position of the selection rectangle. Otherwise the Point(0,0).
     */
    getTopLeftPosition ()
    {

        if (this.selection_node)
        {
            return this.selection_node.bounds.topLeft;
            
        }
        return (new this.papercanvas.paper.Point(0, 0));
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
     *\brief Align all item to the bottom position of bounds
     *
     */
    SelectedAlignBottom ()
    {
        if (this.selecteditems && this.selection_node)
        {
            let bottompos = this.selection_node.bounds.bottom;

            for (let item of this.selecteditems)
            {
                let delta = item.bounds.bottom - bottompos;
                if (Math.abs(delta) > 0.001)
                {
                    item.bounds.bottom = bottompos; // thanks paper.js
                }
            }
            this.updateSelectionDisplay();
        }
    }

    /*!
     *\brief Align all item to the center horizontal position of bounds
     *
     */
    SelectedAlignCenterH ()
    {
        if (this.selecteditems && this.selection_node)
        {
            let centerpos = this.selection_node.bounds.center.x;

            for (let item of this.selecteditems)
            {
                let delta = item.bounds.center.x - centerpos;
                if (Math.abs(delta) > 0.001)
                {
                    item.bounds.center.x = centerpos; // thanks paper.js
                }
            }
            this.updateSelectionDisplay();
        }
    }

    /*!
     *\brief Align all item to the center vertical position of bounds
     *
     */
    SelectedAlignCenterV ()
    {
        if (this.selecteditems && this.selection_node)
        {
            let centerpos = this.selection_node.bounds.center.y;

            for (let item of this.selecteditems)
            {
                let delta = item.bounds.center.y - centerpos;
                if (Math.abs(delta) > 0.001)
                {
                    item.bounds.center.y = centerpos; // thanks paper.js
                }
            }
            this.updateSelectionDisplay();
        }
    }

    /*!
     *\brief Align all item to the left bounds
     *
     */
    SelectedAlignLeftH ()
    {
        if (this.selecteditems && this.selection_node)
        {
            let leftpos = this.selection_node.bounds.x;

            for (let item of this.selecteditems)
            {
                let delta = item.bounds.left - leftpos;
                if (Math.abs(delta) > 0.001)
                {
                    item.bounds.left = leftpos; // thanks paper.js
                }
            }
            this.updateSelectionDisplay();
        }
        
    }
    /*!
     *\brief Align all item to the right bounds
     *
     */
    SelectedAlignRightH ()
    {
        if (this.selecteditems && this.selection_node)
        {
            let rightpos = this.selection_node.bounds.right;

            for (let item of this.selecteditems)
            {
                let delta = item.bounds.right - rightpos;
                if (Math.abs(delta) > 0.001)
                {
                    item.bounds.right = rightpos; // thanks paper.js
                }
            }
            this.updateSelectionDisplay();
        }
        
    }

    /*!
     *\brief Align all item to the top position of bounds
     *
     */
    SelectedAlignTop ()
    {
        if (this.selecteditems && this.selection_node)
        {
            let toppos = this.selection_node.bounds.top;

            for (let item of this.selecteditems)
            {
                let delta = item.bounds.top - toppos;
                if (Math.abs(delta) > 0.001)
                {
                    item.bounds.top = toppos; // thanks paper.js
                }
            }
            this.updateSelectionDisplay();
        }
    }
    /*!
     *\brief Dispatch all items evenly on horizontal axis
     *
     */
    SelectedDispatchH ()
    {
        if (this.selecteditems && this.selection_node)
        {
            if (this.selecteditems.length > 2)
            {
                // make a deep copy to avoid mixing original selection
                let tmp = this.selecteditems.slice ();
                
                // sort items
                tmp.sort ((item1, item2) => {return (item1.bounds.center.x - item2.bounds.center.x);});
                
                // build min max and thorical delta
                let minpos = tmp[0].bounds.center.x;
                let maxpos = tmp[tmp.length - 1].bounds.center.x;
                let meandelta = (maxpos - minpos) / (this.selecteditems.length - 1);

                // apply delta to all item between min and max    
                for (let i = 1; i < tmp.length - 1; i++)
                {
                    let pos = minpos + (meandelta * i);
                    tmp[i].bounds.center.x = pos; 
                }
            }
            this.updateSelectionDisplay();
        }
    
    }
    
    
    /*!
     *\brief Dispatch all items evenly on vertical axis
     *
     */
    SelectedDispatchV ()
    {
        if (this.selecteditems && this.selection_node)
        {
            if (this.selecteditems.length > 2)
            {
                // make a deep copy to avoid mixing original selection
                let tmp = this.selecteditems.slice ();
                
                // sort items
                tmp.sort ((item1, item2) => {return (item1.bounds.center.y - item2.bounds.center.y);});
                
                // build min max and thorical delta
                let minpos = tmp[0].bounds.center.y;
                let maxpos = tmp[tmp.length - 1].bounds.center.y;
                let meandelta = (maxpos - minpos) / (this.selecteditems.length - 1);

                // apply delta to all item between min and max    
                for (let i = 1; i < tmp.length - 1; i++)
                {
                    let pos = minpos + (meandelta * i);
                    tmp[i].bounds.center.y = pos; 
                }
            }
            this.updateSelectionDisplay();
        }
    
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
                // update the single selection
                this.selecteditems[0].position.x = x;
                this.selecteditems[0].position.y = y;
            }

            if (this.selecteditems.length > 1)
            {
                // update all item in selection
                let deltax = x - this.selection_node.bounds.x;
                let deltay = y - this.selection_node.bounds.y;
                
                if (Math.abs(deltax) < 0.01)
                    deltax = 0.0;

                if (Math.abs(deltay) < 0.01)
                    deltay = 0.0;    
                
                // update position of selected items
                for (let item of this.selecteditems)
                {
                    item.position.x = item.position.x + deltax;
                    item.position.y = item.position.y + deltay;
                }
                
                // update position of selection rectangle
                this.selection_node.bounds.x = x;
                this.selection_node.bounds.y = y;
            }
            this.updateSelectionDisplay();
        }
    }
    
    /*!
     *\brief set content text of the current selection
     *
     */
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

    /*!
     *\brief set the current orientation of the selection
     *
     *\param angle the new angle for the selection items orientation
     *
     */
    setAbsoluteAngle (angle)
    {
        if (this.selecteditems) {
            let rotation_point = new this.papercanvas.paper.Point(0, 0);
            let current_angle = this.getSelectionAngle();

            if (this.selecteditems.length === 1) {
                // single selection orientation
                if (this.selecteditems[0].className !== "PointText") {
                    // for braille select the center of tag
                    rotation_point.x = this.selecteditems[0].bounds.center.x;
                    rotation_point.y = this.selecteditems[0].bounds.center.y;
                }
                else {
                    // for graphic primitive select the top left corner of item
                    rotation_point.x = this.selecteditems[0].position.x;
                    rotation_point.y = this.selecteditems[0].position.y;
                }
                // read previous angle
                let current_angle = this.getSelectionAngle();
                
                // do a rotation of the delta angle
                this.selecteditems[0].rotate(angle - current_angle, rotation_point);
            }
            if (this.selecteditems.length > 1 && this.selection_node) {
                // for multiple selection the center of rotation is the center of selection rectangle (bounds of all items)
                rotation_point = this.selection_node.bounds.center;

                for (let item of this.selecteditems) {
                    // apply delta rotation
                    item.rotate(angle - current_angle, rotation_point);
                }
            }

            this.updateSelectionDisplay();
        }
    }

    /*!
     *\brief set the current scale of the selection
     *
     *\param s the new scale for the selection items scaling
     *
     */
    setAbsoluteScale (s)
    {
        if (this.selection_node)
        {
            if ((this.selection_node.width < 10.0 || this.selection_node.height < 10) && s < 1)
                return; // avoid scaling down a too small selection
        }
        if (this.selecteditems)
        {
            // save previous scaling for compute
            let prev_scale = this.getSelectionScale ();

            // scale all items
            for (let item of this.selecteditems)
            {
                if (item.className === "PointText") {
                    // can't scale Braille
                    continue;
                }
                if (item.children)
                {
                    //
                    // Big hack !!!
                    // reverse previous scaling to avoid cumulative effect
                    item.scaling = 1 / item.children[0].scaling.x;

                    // apply scaling
                    item.scaling = s;
                }
            }
            
            // scale relative position
            if (this.selection_node && 
                this.selecteditems.length > 1 && 
                prev_scale > 0.001)
            {
                let tl = this.selection_node.bounds.topLeft;
                
                let scale = s / prev_scale;
                
                console.log ("scale cur, prev, calc", s, prev_scale, scale);

                for (let item of this.selecteditems)
                {
                    // compute distance for top left
                    let dist = item.position.getDistance (tl);
                    
                    if (Math.abs(dist) > 1)
                    {
                        // update relative position
                        let pos = new paper.Point (item.position);
                        console.log ("old position", pos, tl);
                        
                        // detailed vector operation as it seem there is a bug in paper.js 
                        // with Point - Point operation
                        
                        pos.x = pos.x - tl.x;
                        pos.y = pos.y - tl.y;
                        console.log ("relative position", pos);
                        
                        pos.x = pos.x * scale;
                        pos.y = pos.y * scale;
                        console.log ("scaled relative pos", pos, s, scale);
                        item.position.x = pos.x + tl.x;
                        item.position.y = pos.y + tl.y;
                        console.log ("final pos", pos);
                    }
                }
            }
            this.updateSelectionDisplay();
        }
    }

    /*!
     *\brief offset the position of all items in selection 
     *
     *\param x delta position in x axis
     *\param y delta position in y axis
     *
     */
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

    /*!
     *\brief Apply a relative rotation to all items in selection
     * The funtion apply a rotation given by the angle formed by the 2 vectors :
     * center -> startpt
     * center -> endpt
     * 
     *\param startpt the start point
     *\param endpt the end point
     *
     */
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

    /*!
     *\brief Send the selection to the back in Z order
     *
     */
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

    /*!
     *\brief Update the selection bounding rectangle
     *
     */
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