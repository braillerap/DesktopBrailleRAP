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
import { useState, useContext } from 'react';
import AppContext from "../components/AppContext";
import { PiAlignCenterHorizontalBold } from "react-icons/pi";
import { PiAlignLeftBold } from "react-icons/pi";
import { PiAlignRightBold } from "react-icons/pi";
import { PiAlignCenterVerticalBold } from "react-icons/pi";
import { PiAlignTopBold } from "react-icons/pi";
import { PiAlignBottomBold } from "react-icons/pi";
import { PiSplitVerticalBold } from "react-icons/pi";
import { PiSplitHorizontalBold } from "react-icons/pi";


const Position = () => {

    const { Size, Position, Angle, Scale, GetPaperCanvas, GetLocaleString, MultipleSelection } = useContext(AppContext);
    const [NewX, setNewX] = useState(0);
    const [NewY, setNewY] = useState(0);
    const [NewAngle, setNewAngle] = useState(0);
    const [NewScale, setNewScale] = useState(1);

    const handleSetPosition = (e) => {
        e.stopPropagation();

        let canv = GetPaperCanvas();
        if (canv) {
            canv.setPositionCurrent(NewX, NewY);
        }
    };
    const handleSetAngle = (e) => {
        e.stopPropagation();

        let canv = GetPaperCanvas();
        if (canv) {
            canv.setAngleCurrent(NewAngle);
        }
    };
    const handleSetScale = (e) => {
        e.stopPropagation();

        let canv = GetPaperCanvas();
        if (canv) {
            canv.setScaleCurrent(NewScale / 100);
        }
    };

    const handleAlignLeftH = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedAlignLeftH();
        }
    };

    const handleAlignCenterH = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedAlignCenterH();
        }
    };

    const handleAlignRightH = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedAlignRightH();
        }
    };

    const handleAlignTop = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedAlignTop();
        }
    }

    const handleAlignCenterV = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedAlignCenterV();
        }
    }

    const handleAlignBottom = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedAlignBottom();
        }
    }

    const handleDispatchH = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedDispatchH();
        }
    }

    const handleDispatchV = () => {
        let canv = GetPaperCanvas();
        if (canv) {
            canv.SelectedDispatchV();
        }
    }
    return (
        <>


            <div className='div_column'>
                <div className="Group">
                    <h3>{GetLocaleString("position.position")} (mm)</h3>
                    <p>{Position[0].toFixed(2)} - {Position[1].toFixed(2)}</p>
                    <h3>{GetLocaleString("position.size")} (mm)</h3>
                    <p>{Size[0].toFixed(2)} - {Size[1].toFixed(2)}</p>

                </div>
                <div className="Group -ml-px">
                    <h3>{GetLocaleString("position.angle")} (deg)</h3>
                    <p>{Angle.toFixed(2)} </p>

                </div>
                <div className="Group -ml-px">
                    <h3>{GetLocaleString("position.scale")} (%)</h3>
                    <p>{Scale.toFixed(2)} </p>

                </div>
            </div>
            <div className='div_column'>
                <div className="Group -mt-px">
                    <p>
                        <label>
                            X: <input type="number"
                                name="myInputX"
                                className='textedit w-25'
                                onChange={(e) => { setNewX(e.target.value) }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSetPosition(e);
                                    }
                                }}
                            />
                        </label>
                    </p>
                    <p>
                        <label>
                            Y: <input type="number"
                                name="myInputY"
                                className='textedit w-25'
                                onChange={(e) => { setNewY(e.target.value) }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSetPosition(e);
                                    }
                                }}
                            />
                        </label>
                    </p>
                    <button onClick={handleSetPosition} className='btn btn-blue w-full self-end'>{GetLocaleString("position.setposition")}</button>
                </div>
                <div className="Group -ml-px -mt-px">
                    <p>
                        <label>
                            {GetLocaleString("position.angle")}:
                            <input type="number"
                                name="myInputA"
                                className='textedit w-25'
                                onChange={(e) => { setNewAngle(e.target.value) }}
                                onKeyDown={(e) => { if (e.key === "Enter") { handleSetAngle(e); } }} />
                        </label>
                    </p>

                    <button
                        onClick={handleSetAngle}
                        className='btn btn-blue w-full self-end'>{GetLocaleString("position.setangle")}</button>
                </div>
                <div className="Group -ml-px -mt-px">
                    <div>
                        <label>
                            {GetLocaleString("position.scale")}:
                            <input type="number"
                                name="myInputS"
                                className='textedit w-25'
                                onChange={(e) => { setNewScale(e.target.value) }}
                                onKeyDown={(e) => { if (e.key === "Enter") { handleSetScale(e); } }}
                            />
                        </label>
                    </div>
                    
                    <button onClick={handleSetScale} className='btn btn-blue w-full '>{GetLocaleString("position.setscale")}</button>
                </div>
            </div>
            
            <div className='div_column'>
                <div className="Group -mt-px">

                    <h3>{GetLocaleString("position.align.horizontal")}</h3>
                    <p>
                        <button onClick={handleAlignLeftH} className='btn btn-blue  w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiAlignLeftBold /> {GetLocaleString("position.align.left")}</div>
                        </button>
                        
                        <button onClick={handleAlignRightH} className='btn btn-blue  w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiAlignRightBold /> {GetLocaleString("position.align.right")}</div>
                        </button>
                    
                        <button onClick={handleAlignCenterH} className='btn btn-blue  w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiAlignCenterHorizontalBold /> {GetLocaleString("position.align.centerh")}</div>
                        </button>
                    </p>

                </div>
                <div className="Group -ml-px -mt-px">
                    <h3>{GetLocaleString("position.align.vertical")}</h3>
                    <p>
                        <button onClick={handleAlignTop} className='btn btn-blue  w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiAlignTopBold /> {GetLocaleString("position.align.top")}</div>
                        </button>
                      
                        <button onClick={handleAlignBottom} className='btn btn-blue w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiAlignBottomBold /> {GetLocaleString("position.align.bottom")}</div>
                        </button>

                   
                        <button onClick={handleAlignCenterV} className='btn btn-blue w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiAlignCenterVerticalBold /> {GetLocaleString("position.align.centerv")}</div>
                        </button>

                    </p>

                </div>
                <div className="Group -ml-px -mt-px">
                    <h3>{GetLocaleString("position.dispatch")}</h3>
                    <p>
                        <button onClick={handleDispatchV} className='btn btn-blue w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiSplitVerticalBold /> {GetLocaleString("position.dispatch.vert")}</div>
                        </button>
                    
                        <button onClick={handleDispatchH} className='btn btn-blue w-full' disabled={!MultipleSelection}>
                            <div className='btn_icon'><PiSplitHorizontalBold /> {GetLocaleString("position.dispatch.horiz")}</div>
                        </button>
                    </p>


                </div>
            </div>
        </>
    );
};

export default Position;