import French from '../locales/fr.json';
import English from '../locales/en.json';
import Spanish from '../locales/es.json';
import Deutch from '../locales/de.json';
import Netherland from '../locales/nl.json';
import Arabic from '../locales/ar.json';

const locales = {
    "ar": {lang:"ar", dir:"rtl", desc:"English",  reverse:true, data:Arabic},
    "en": {lang:"en", dir:"ltr", desc:"English",  reverse:false, data:English},
    "es": {lang:"es", dir:'ltr', desc:'Español', reverse:false, data:Spanish},
    "de": {lang:"de", dir:'ltr', desc:'Deutch', reverse:false, data:Deutch},
    "fr": {lang:"fr", dir:'ltr', desc:'Français', reverse:false, data:French},
    "nl": {lang:"nl", dir:'ltr', desc:'Dutch', reverse:false, data:Netherland}
    
}; 

export default locales;