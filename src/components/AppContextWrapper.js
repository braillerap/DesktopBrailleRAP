import React, { useState } from 'react';
import AppContext from './AppContext';
import AppOption from './AppOption.js';

import mouseMode from '../mouseMode.js';
import LocaleString from './localestring.js';
import Backend from './backend.js';

let paperinstance = null;
let papercanvas = null;
let importsvg = null;
let importtxt = null;
let louis = null;

let position = [0, 0];
let size = [0, 0];
let mousemode = mouseMode.MOVE;
let angle = 0;
let params = AppOption;
let selected = null;
let pywebviewready = false;
let locale = "fr";
let localedata = new LocaleString();
let scale = 100;
let backend = new Backend();

const AppContextWrapper = (props) => {
    const [MouseMode, setMouseMode] = useState(mousemode);
    const [Position, setPosition] = useState(position);
    const [Size, setSize] = useState(size);
    const [Angle, setAngle] = useState(angle);
    const [Scale, setScale] = useState(scale);
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
    function getLocaleData ()
    {
        console.log ("localedata in context:" + localedata);

        return (localedata);
    }
    function setAppLocale (localecode)
    {
        console.log ("setAppLocale:" + localecode);
        localedata.setLocaleCode(localecode);
        setLocale(localedata.getLocaleCode());
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
   
    function getLocaleString (id)
    {
        return localedata.getLocaleString(id);

    }
    function getLocaleDir()
    {
        return localedata.getLocaleDir();
    }
    function getBrailleReverse()
    {
        return localedata.getBrailleReverse();
    }
    function getBackend()
    {
        return backend;
    } 

    return (
        <AppContext.Provider value={{
            message: "message", SetPaper: setPaper, GetPaper: getPaper,
            SetPaperCanvas: setPaperCanvas, GetPaperCanvas: getPaperCanvas,
            SetLouis: setLouis, GetLouis: getLouis,
            SetOption: setOption,
            GetLocaleData: getLocaleData,
            SetAppLocale: setAppLocale,
            GetLocaleString: getLocaleString,
            GetLocaleDir: getLocaleDir,
            GetBrailleReverse: getBrailleReverse,
            GetBackend: getBackend, 
            Position, setPosition,
            Size, setSize,
            Angle, setAngle,
            Scale, setScale,
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
