/**
 * \file            localestring.js
 * \brief           LocaleString class to handle locale translation
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
import locales from './locales.js';
class LocaleString {
    constructor() {
        this.locale = locales;
        this.selectedlocale = 'fr'; // select fr as default
    }

    
    getLocaleString(id) {

        if (id in this.locale[this.selectedlocale].data)
            return (this.locale[this.selectedlocale].data[id])
        console.log("invalid id " + id + " locale " + this.selectedlocale)

        //fallback to en locale
        if (id in this.locale["en"].data)
            return (this.locale["en"].data[id])
        // definetly bad id
        return ("Unknown locale id ???")
    }
    getLocaleDir(dir) {
        return (this.locale[this.selectedlocale].dir)
    }
    getBrailleReverse() {
        return (this.locale[this.selectedlocale].reverse)
    }
    setLocaleCode(locale) {
        if (locale in this.locale)
            this.selectedlocale = locale;

    }
    getLocaleCode() {
        return (this.selectedlocale)
    }
    getLocaleList() {
        let list = [];
        for (let locale in this.locale) {
            list.push(this.locale[locale]);

        }
        return (list);
    }
};

export default LocaleString;