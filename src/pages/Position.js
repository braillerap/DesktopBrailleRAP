/**
 * \file            Position.js
 * \brief           Position application form
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
import { useState, useContext} from 'react';
import AppContext from "../components/AppContext";

const Position = () => {

    const { Size, Position , Angle, Scale, GetPaperCanvas, GetLocaleString} = useContext(AppContext);
    const [NewX, setNewX] = useState(0);
    const [NewY, setNewY] = useState(0);
    const [NewAngle, setNewAngle] = useState(0);
    const [NewScale, setNewScale] = useState(1);

    const handleSetPosition = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv)
        {
            canv.setPositionCurrent(NewX, NewY);
        }   
    };
    const handleSetAngle = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv)
        {
            canv.setAngleCurrent(NewAngle);
        }   
    };
    const handleSetScale = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv)
        {
            canv.setScaleCurrent(NewScale / 100);
        }   
    };
    return (
        <>
            

                <div className='div_column'>
                    <div className="Group">
                        <h3>{GetLocaleString("position.position")} (mm)</h3>
                        <p>{Position[0].toFixed(2)} - {Position[1].toFixed(2)}</p>
                        <h3>{GetLocaleString("position.size")} (mm)</h3>
                        <p>{Size[0].toFixed(2)} - {Size[1].toFixed(2)}</p>
                        
                    </div>
                    <div className="Group">
                        <h3>{GetLocaleString("position.angle")} (deg)</h3>
                        <p>{Angle.toFixed(2)} </p>
                        
                    </div>
                    <div className="Group">
                        <h3>{GetLocaleString("position.scale")} (%)</h3>
                        <p>{Scale.toFixed(2)} </p>
                        
                    </div>
                </div>
                <div className='div_column'>
                    <div className="Group">
                        <p>
                            <label>
                                X: <input type="number"  
                                        name="myInputX" 
                                        style={{ width: "5em" }} 
                                        onChange={(e) => { setNewX(e.target.value) }} 
                                        onKeyDown={(e) => { if (e.key === "Enter") { 
                                            handleSetPosition (e); 
                                        } }}
                                    />
                            </label>
                        </p>
                        <p>
                            <label>
                                Y: <input type="number"  
                                    name="myInputY" 
                                    style={{ width: "5em" }} 
                                    onChange={(e) => { setNewY(e.target.value) }} 
                                    onKeyDown={(e) => { if (e.key === "Enter") { 
                                            handleSetPosition (e); 
                                        } }}
                                    />
                            </label>
                        </p>
                        <button onClick={handleSetPosition} className='pure-button'>{GetLocaleString("position.setposition")}</button>
                    </div>
                    <div className="Group">
                        <p>
                            <label>
                            {GetLocaleString("position.angle")}: 
                                <input type="number"  
                                name="myInputA" 
                                style={{ width: "3em" }} 
                                onChange={(e) => { setNewAngle(e.target.value) }} 
                                onKeyDown={(e) => { if (e.key === "Enter") { handleSetAngle(e); } }}/>
                            </label>
                        </p>
                        
                        <button 
                            onClick={handleSetAngle} 
                            className='pure-button'>{GetLocaleString("position.setangle")}</button>
                    </div>
                    <div className="Group">
                        <p>
                            <label>
                            {GetLocaleString("position.scale")}: 
                                <input type="number"  
                                            name="myInputS" 
                                            style={{ width: "3em" }} 
                                            onChange={(e) => { setNewScale(e.target.value) }}
                                            onKeyDown={(e) => { if (e.key === "Enter") { handleSetScale(e); } }} 
                                />
                            </label>
                        </p>
                        
                        <button onClick={handleSetScale} className='pure-button'>{GetLocaleString("position.setscale")}</button>
                    </div>
                </div>
        </>
    );
};

export default Position;