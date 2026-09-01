/**
 * \file            backend.js
 * \brief           Abstract access to local ressource like files or serial port
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

const status = {
            message:"",
            status: 0
        };
class BackendWebLocal {
    constructor() {
        this.backendready = false;
        this.service = "";

    }
    isbackendready() {
        return this.backendready;
    }

    setbackendready(status) {
        this.backendready = status;
    }
    setService (service)
    {
        this.service = service;
    }
    getService ()
    {
        return (this.service);
    }
    async get_parameters() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "/desktopbrap/local/get_parameters", false); // false for synchronous request
        xmlHttp.send(null);
        console.log("parameters", xmlHttp.responseText);
        return xmlHttp.responseText;

        return await window.pywebview.api.get_parameters();
    }

    async gcode_set_parameters (appparam) {
        let param = {"service":this.service, "options":appparam};
        const request = new Request("/local/gcode_set_parameters", {
            method: "POST",
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                }
        });
        let response = await fetch (request);

        return
    }
    async get_runtime_options() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "/desktopbrap/local/get_runtime_options", false); // false for synchronous request
        xmlHttp.send(null);
        console.log("parameters", xmlHttp.responseText);
        return xmlHttp.responseText;

    }

    async gcode_get_serial() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "/local/gcode_get_serial", false); // false for synchronous request
        xmlHttp.send(null);
        console.log("gcode_get_serial", xmlHttp.responseText);
        return xmlHttp.responseText;
    }

    AsyncPrintGcode(gcode, comport) {

        let param = {"gcode":gcode, "port":comport};
        const request = new Request("/local/gcode_print", {
            method: "POST",
            body: JSON.stringify(param),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                }
        });

        return fetch (request).then((response)=> (response.json()));

    }

    CancelPrint() {
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
        xmlhttp.open("POST", "/local/gcode_cancelprint", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        return xmlhttp.send(JSON.stringify({ "cancel": true }));
    }
}
class BackendPyWebview {

    constructor() {
        this.backendready = false;
        this.service = "";

    }

    isbackendready() {
        return this.backendready;
    }

    setbackendready(status) {
        // clear pywebview shared storage
        window.pywebview.state = {};

        console.log ("set backendready ", status);
        this.backendready = status;
    }
    setService (service)
    {
        this.service = service;
    }
    getService ()
    {
        return (this.service);
    }

    async get_parameters() {
        return await window.pywebview.api.get_parameters();
    }
    async get_runtime_options() {
        return await window.pywebview.api.get_runtime_options();
    }

    async confirm_dialog(title, message) {
        let ret = await window.pywebview.api.confirm_dialog(title, message);
        console.log("return from pywebview confirm_dialog: ", ret)
        if (ret)
            return true;
        else
            return false;
    }

    async import_file(dialogtitle, filter, types) {
        let ret = await window.pywebview.api.import_file(dialogtitle, filter, types);

        return ret;
    }

    async save_file(data, dialogtitle, filter, types) {
        let ret = await window.pywebview.api.save_file(data, dialogtitle, filter, types);

        return ret;
    }

    async saveas_file(data, dialogtitle, filter, types) {
        let ret = await window.pywebview.api.saveas_file(data, dialogtitle, filter, types);

        return ret;
    }

    async load_file(dialogtitle, filter, types) {
        let ret = await window.pywebview.api.load_file(dialogtitle, filter, types);

        return ret;
    }

    async quit() {
        console.log("request for exit");
        window.pywebview.api.quit();
    }

    async read_file(filename) {
        let ret = await window.pywebview.api.read_file(filename);
        return ret;
    }

    async download_file(gcode, dialogtitle, filter, types) {
        let ret = await window.pywebview.api.download_file(gcode, dialogtitle, filter, types);

        return ret;
    }
    async gcode_get_serial() {
        let ret = await window.pywebview.api.gcode_get_serial();

        return ret;
    }

    async gcode_set_parameters(options) {
        await window.pywebview.api.gcode_set_parameters(options);
    }

    AsyncPrintGcode(gcode, comport) {
        return window.pywebview.api.PrintGcode(gcode, comport);
    }
    CancelPrint() {
        window.pywebview.api.CancelPrint();
    }
};

class Backend {
    constructor() {
        this.backendready = false;

        if (process.env.REACT_APP_LOCALWEB)
            this.backend = new BackendWebLocal();
        else
            this.backend = new BackendPyWebview();
    }

    isbackendready() {
        return this.backendready;
    }

    setbackendready(status) {
        console.log("set backend status");
        this.backendready = status;
    }
    setService (service)
    {
        this.backend.setService(service);
    }
    getService ()
    {
        return (this.backend.getService());
    }
    async confirm_dialog(title, message) {
        if (this.backendready) {
            let ret = await this.backend.confirm_dialog(title, message);
            console.log("return from backend confirm_dialog: ", ret)
            return ret;

        }
    }
    async import_file(dialogtitle, filter, types) {
        if (this.backendready) {
            let ret = await this.backend.import_file(dialogtitle, filter, types);

            return ret;
        }
    }

    async save_file(data, dialogtitle, filter, types) {
        if (this.backendready) {
            let ret = await this.backend.save_file(data, dialogtitle, filter, types);

            return ret;
        }
    }
    async saveas_file(data, dialogtitle, filter, types) {
        if (this.backendready) {
            let ret = await this.backend.saveas_file(data, dialogtitle, filter, types);

            return ret;
        }
    }

    async load_file(dialogtitle, filter, types) {
        if (this.backendready) {
            let ret = await this.backend.load_file(dialogtitle, filter, types);

            return ret;
        }
    }

    async read_file(filename) {
        if (this.backendready) {
            let ret = await this.backend.read_file(filename);

            return ret;
        }
        return "";
    }
    async quit() {
        if (this.backendready)
            this.backend.quit();
    }

    async download_file(gcode, dialogtitle, filter, types) {
        if (this.backendready) {
            let ret = await this.backend.download_file(gcode, dialogtitle, filter, types);
            return ret;
        }
        return "";
    }
    async gcode_get_serial() {
        if (this.backendready) {
            console.log("backend calling gcode_get_serial");
            let ret = await this.backend.gcode_get_serial();

            return ret;

        }
        else {
            console.log("backend is not ready");
        }
        return [];
    }

    async gcode_set_parameters(options) {
        console.log ("backend set parameters ", options);
        if (this.backend) {
            console.log ("calling instantiate backend to set parameters ", options)
            await this.backend.gcode_set_parameters(options);
        }
    }
    AsyncPrintGcode(gcode, comport) {
        
        if (this.backendready) {
            
            return this.backend.AsyncPrintGcode(gcode, comport);
        }
        // return a promise as the function should be async
        let pr = new Promise ((resolve, reject)=> {
            // build a status similar to AsyncPrintGcode return
            let ret = status;
            ret.message = "backend not ready";
            ret.status = 1;

            resolve ( ret);
        });
        
        return pr;
    }
    AsyncCancelPrint() {
        if (this.backendready) {
            this.backend.CancelPrint();
        }
    }

    async get_parameters() {
        if (this.backendready)
            return await this.backend.get_parameters();
    }
    async get_runtime_options() {
        if (this.backendready)
            return await this.backend.get_runtime_options();
    }
}

export default Backend;
