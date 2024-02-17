import React, { useState } from 'react';
import AppContext from './AppContext';



let     paperinstance = null;
let     papercanvas = null;
let     importsvg = null;
let     importtxt = null;
let     louis =null;

let     position = [0,0];
let     size = [0,0];
let     rotate=false;
let     angle = 0;
let     params={};
let     selected= null;

const AppContextWrapper = (props)  => {
    const [Position, setPosition] = useState(position);
    const [Size, setSize] = useState(size);
    const [Rotate, setRotate] = useState(rotate);
    const [Angle, setAngle] = useState(angle);
    const [Params, setParams] = useState(params);
    const [Selected, setSelected] = useState(selected);

    function setPaper (paper)
    {
        paperinstance = paper;
        console.log ("setpaper:" + paper);
    }
    function getPaper ()
    {
        return paperinstance;
    }
    function setImportSVG (svgfunc)
    {
        importsvg = svgfunc;
    }
    function getImportSVG ()
    {
        return (importsvg);
    }
    function setImportText (txtfunc)
    {
        importtxt = txtfunc;
    }
    function getImportText ()
    {
        return (importtxt);
    }
    function setPaperCanvas (pcanvas)
    {
        papercanvas = pcanvas;
    }
    function getPaperCanvas ()
    {
        return (papercanvas);
    }
    function setLouis (louiswrap)
    {
        louis = louiswrap;
    }
    function getLouis ()
    {
        return(louis);
    }
    
    return(
        <AppContext.Provider  value={{message:"message", SetPaper:setPaper, GetPaper:getPaper, 
            SetImportSVG:setImportSVG, GetImportSVG:getImportSVG, 
            SetImportText:setImportText, GetImportText:getImportText, 
            SetPaperCanvas:setPaperCanvas, GetPaperCanvas:getPaperCanvas,
            SetLouis:setLouis, GetLouis:getLouis,
            Position, setPosition,
            Size, setSize,
            Angle, setAngle,
            Rotate, setRotate,
            Selected, setSelected,
            Params, setParams}} >
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextWrapper;
