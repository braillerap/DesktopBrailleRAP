import locales from './locales.js';
class LocaleString
{
    constructor ()
    {
        this.locale = locales;
        this.selectedlocale = 'fr'
    }
    getLocaleString (id)
    {
        if(id in this.locale[this.selectedlocale].data)
            return (this.locale[this.selectedlocale].datas[id])
        console.log ("invalid id " + id + " locale " + this.selectedlocale)
        
        return ("Unknown locale string ???")
    }
    setLocaleCode (locale)
    {
        if (locale in this.locale)
            this.selectedlocale = locale;
        
    }
    getLocaleCode ()
    {
        return (this.selectedlocale)
    }
};

export default LocaleString;