import locales from './locales.js';
class LocaleString
{
    constructor ()
    {
        this.locale = locales;
        this.selectedlocale = 'fr'
        console.log ("LocaleString constructor");
        
    }
    getLocaleString (id)
    {
        console.log ("searching locale id " + id);
        console.log (this.locale[this.selectedlocale].data);
        if(id in this.locale[this.selectedlocale].data)
            return (this.locale[this.selectedlocale].data[id])
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
    getLocaleList ()
    {
        let list = [];
        for (let locale in this.locale)
            {
                list.push (this.locale[locale]);
                
            }
        return (list);
    }
};

export default LocaleString;