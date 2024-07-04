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