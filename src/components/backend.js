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
class BackendPyWebview {
    
    
    async confirm_dialog (title, message)
    {
        let ret = await window.pywebview.api.confirm_dialog(title,message);
        console.log ("return from pywebview confirm_dialog: ", ret)
        if (ret)
            return true;
        else
            return false;
    }

    async import_file(dialogtitle, filter, types)
    {
        let ret = await window.pywebview.api.import_file(dialogtitle, filter, types);

        return ret;
    }

    async save_file(data, dialogtitle, filter,types)
    {
        let ret = await window.pywebview.api.save_file(data, dialogtitle, filter, types);

        return ret;
    }

    async saveas_file(data, dialogtitle, filter, types)
    {
        let ret = await window.pywebview.api.saveas_file(data, dialogtitle, filter, types);

        return ret;
    }

    async load_file(dialogtitle, filter, types)
    {
        let ret = await window.pywebview.api.load_file(dialogtitle, filter, types);

        return ret;
    }

    async quit ()
    {
        console.log ("request for exit");
        window.pywebview.api.quit();
    }

    async read_file (filename)
    {
        let ret = await window.pywebview.api.read_file(filename);
        return ret;
    }

    async download_file(gcode, dialogtitle, filter, types)
    {
        let ret = await window.pywebview.api.download_file(gcode, dialogtitle, filter, types);

        return ret;
    }
    async gcode_get_serial()
    {
        let ret = await window.pywebview.api.gcode_get_serial();

        return ret;
    }

    async gcode_set_parameters (options)
    {
        await window.pywebview.api.gcode_set_parameters (options);
    }

    AsyncPrintGcode(gcode, comport)
    {
        return window.pywebview.api.PrintGcode(gcode, comport);
    }
    CancelPrint() 
    {
        window.pywebview.api.CancelPrint();
    }
};

class Backend {
    constructor() {
        this.backendready = false;   
        this.backend = new BackendPyWebview();
    }

    isbackendready() 
    { 
        return this.backendready; 
    }

    setbackendready (status)
    {
        this.backendready = status;
    }

    async confirm_dialog (title, message)
    {
        if (this.backendready)
        {
            let ret = await this.backend.confirm_dialog(title, message);
            console.log ("return from backend confirm_dialog: ", ret)
            return ret;
            
        }
    }
    async import_file(dialogtitle, filter, types)
    {
        if (this.backendready)
        {
            let ret = await this.backend.import_file(dialogtitle, filter, types);

            return ret;
        }
    }

    async save_file(data, dialogtitle, filter, types)
    {
        if (this.backendready)
        {
            let ret = await this.backend.save_file(data, dialogtitle, filter, types);

            return ret;
        }
    }
    async saveas_file(data, dialogtitle, filter, types)
    {
        if (this.backendready)
        {
            let ret = await this.backend.saveas_file(data, dialogtitle, filter, types);

            return ret;
        }
    }

    async load_file(dialogtitle, filter, types)
    {
        if (this.backendready)
        {
            let ret = await this.backend.load_file(dialogtitle, filter, types);

            return ret;
        }
    }

    async read_file(filename)
    {
        if (this.backendready)
        {
            let ret = await this.backend.read_file(filename);

            return ret;
        }
        return "";
    }
    async quit ()
    {
        if (this.backendready)
            this.backend.quit ();
    }

    async download_file(gcode, dialogtitle, filter, types)
    {
        if (this.backendready)
        {
            let ret = await this.backend.download_file(gcode, dialogtitle, filter, types);
            return ret;
        }
        return "";
    }
    async gcode_get_serial()
    {
        if (this.backendready)
        {
            let ret = await this.backend.gcode_get_serial();

            return ret;

        }
        return [];
    }

    async gcode_set_parameters (options)
    {
        if (this.backend)
        {
            await this.backend.gcode_set_parameters (options);
        }
    }
    AsyncPrintGcode(gcode, comport)
    {
        if (this.backendready)
        {
            return this.backend.AsyncPrintGcode(gcode, comport);
        }
        return "";
    }
    AsyncCancelPrint() 
    {
        if (this.backendready)
        {
            this.backend.CancelPrint();
        }
    }
}

export default Backend;
