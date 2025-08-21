import French from '../locales/fr.json';
import English from '../locales/en.json';
import Spanish from '../locales/es.json';
import Deutch from '../locales/de.json';
import Netherland from '../locales/nl.json';
import Arabic from '../locales/ar.json';
import Ukrainian from '../locales/uk.json';
import SimpleChineese from '../locales/zh_hans.json';
import Greek from '../locales/el.json'
import Italian from '../locales/it.json';
import Portuguese from '../locales/pt.json';
import Indonesian from '../locales/id.json';

const locales = {
    "ar":       {lang:"ar", dir:"rtl", desc:"ar -  عربي",               reverse:true,  data:Arabic},
    "de":       {lang:"de", dir:'ltr', desc:'de - Deutch',              reverse:false, data:Deutch},
    "es":       {lang:"es", dir:'ltr', desc:'es - Español',             reverse:false, data:Spanish},
    "el":       {lang:"el", dir:'ltr', desc:'el - ελληνικά',            reverse:false, data:Greek},
    "en":       {lang:"en", dir:"ltr", desc:"en - English",             reverse:false, data:English},
    "fr":       {lang:"fr", dir:'ltr', desc:'fr - Français',            reverse:false, data:French},
    "id":       {lang:"id", dir:'ltr', desc:'id - Bahasa',              reverse:false, data:Indonesian},
    "it":       {lang:"it", dir:'ltr', desc:'it - Italiano',            reverse:false, data:Italian},
    "nl":       {lang:"nl", dir:'ltr', desc:'nl - Dutch',               reverse:false, data:Netherland},
    "pt":       {lang:"pt", dir:'ltr', desc:'pt - Português',           reverse:false, data:Portuguese},
    "uk":       {lang:"uk", dir:'ltr', desc:'uk - українська',          reverse:false, data:Ukrainian},
    "zh-hans":  {lang:"zh-hans", dir:'ltr', desc:'zh-hans - 简体中文',   reverse:false, data:SimpleChineese}
}; 

export default locales;