import React, { useState } from 'react';
import AppContext from './AppContext';
import AppOption from './AppOption';
import locales from './components/locales.js'

let paperinstance = null;
let papercanvas = null;
let importsvg = null;
let importtxt = null;
let louis = null;

let position = [0, 0];
let size = [0, 0];
let mousemode = false;
let angle = 0;
let params = AppOption;
let selected = null;
let pywebviewready = false;
let locale = 'fr'
let selectedlocale = locales[0];

const AppContextWrapper = (props) => {
    const [Position, setPosition] = useState(position);
    const [Size, setSize] = useState(size);
    const [MouseMode, setMouseMode] = useState(mousemode);
    const [Angle, setAngle] = useState(angle);
    const [Params, setParams] = useState(params);
    const [Selected, setSelected] = useState(selected);
    const [PyWebViewReady, setPyWebViewReady] = useState(pywebviewready);
    const [Locale, setLocale] = useState(locale);

    function setPaper(paper) {
        paperinstance = paper;
        console.log("setpaper:" + paper);
    }
    function getPaper() {
        return paperinstance;
    }
    function setImportSVG(svgfunc) {
        importsvg = svgfunc;
    }
    function getImportSVG() {
        return (importsvg);
    }
    function setImportText(txtfunc) {
        importtxt = txtfunc;
    }
    function getImportText() {
        return (importtxt);
    }
    function setPaperCanvas(pcanvas) {
        papercanvas = pcanvas;
    }
    function getPaperCanvas() {
        return (papercanvas);
    }
    function setLouis(louiswrap) {
        louis = louiswrap;
    }
    function getLouis() {
        return (louis);
    }
    function setOption(opt) {
        setParams(opt);
        if (window.pywebview)
            window.pywebview.api.gcode_set_parameters(opt);

    }
    function formatMessage (id)
    {
        

        return ("translation error");
    }
    return (
        <AppContext.Provider value={{
            message: "message", SetPaper: setPaper, GetPaper: getPaper,
            SetImportSVG: setImportSVG, GetImportSVG: getImportSVG,
            SetImportText: setImportText, GetImportText: getImportText,
            SetPaperCanvas: setPaperCanvas, GetPaperCanvas: getPaperCanvas,
            SetLouis: setLouis, GetLouis: getLouis,
            SetOption: setOption,
            Position, setPosition,
            Size, setSize,
            Angle, setAngle,
            MouseMode, setMouseMode,
            Selected, setSelected,
            Params, setParams,
            PyWebViewReady, setPyWebViewReady,
            Locale, setLocale
        }} >
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextWrapper;
