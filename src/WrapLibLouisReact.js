import createModule from "./liblouisreact.mjs"; // eslint-disable-line

function wrap_lou_free (module)
{
    return (() => {

        
        let error = module.ccall ("lou_free", "number", [], 
                                []
                                );
        return error;
      });
}
function wrap_lou_char_size (module)
{
    return (() => {

        
        let value = module.ccall ("lou_charSize", "number", [], 
                                []
                                );
        return value;
      });
}
/*
int EXPORT_CALL
lou_checkTable(const char *tableList);
*/
function wrap_lou_checkTable (module)
{
    return ((str) => {

        let len = str.length;
        let ptr = module._malloc ((len + 1));
        
        module.stringToASCII(str, ptr, (len + 1));
        
        let result = module.ccall ("lou_checkTable", "number", ["number"], 
                                [ptr]
                                );
        module._free (ptr);                            
        
        return (result);
      });

}
/*
LIBLOUIS_API
int EXPORT_CALL
lou_compileString(const char *tableList, const char *inString);
*/
function wrap_lou_compile_string (module)
    {
        return ((tablelist, inString) => {

            
            let ptr_table = module._malloc (tablelist.length + 1);
            let ptr_in = module._malloc (inString.length + 1);

            module.stringToASCII(tablelist, ptr_table, tablelist.length + 1);
            module.stringToASCII(inString, ptr_in, inString.length + 1);

            let result = module.ccall ("lou_compileString", "number", ["number", "number"], 
                                    [ptr_table, ptr_in]
                                    );
            module._free (ptr_table);                            
            module._free (ptr_in);                            
            
            
            return (result);
          });
    }
/*
LIBLOUIS_API
formtype EXPORT_CALL
lou_getTypeformForEmphClass(const char *tableList, const char *emphClass);
*/
function wrap_getTypeformForEmphClass (module)
    {
        return ((tablelist, epmhClass) => {

            let ptr_table = module._malloc (tablelist.length + 1);
            let ptr_in = module._malloc (epmhClass.length + 1);

            module.stringToASCII(tablelist, ptr_table, tablelist.length + 1);
            module.stringToASCII(epmhClass, ptr_in, epmhClass.length + 1);

            let result = module.ccall ("lou_getTypeformForEmphClass", "number", ["number", "number"], 
                                    [ptr_table, ptr_in]
                                    );
            module._free (ptr_table);                            
            module._free (ptr_in);                            
            
            return (result);
          });
    }

function wrap_unicode_translate_string (module)
    {
        return ((str, tableid) => {

            let len = str.length;
            let ptr = module._malloc ((len + 4) * 4);
            
            module.stringToUTF32(str, ptr, (len + 4) * 4);
            
            let result = module.ccall ("unicode_translate_string", "number", ["number", "number", "number"], 
                                    [ptr, len+4, tableid]
                                    );
            
            module._free (ptr);                            
            
            let error = module.ccall ("unicode_translate_get_status", "number", [], 
                                    []
                                    );
            let rstr = "";
            
            if (error === 1)
            {
              rstr=module.UTF32ToString (result, (len + 4) * 4 * 2);
            }
            else
              rstr ="Error while translating " + error.toString()  
            
            module._free(result);
            return (rstr);
          });
    }
    /*
    void EXPORT_CALL
lou_setLogLevel(logLevels level);
*/

    function wrap_set_log_level(module)
    {
        return ((level) => {
    
            module.ccall ("lou_setLogLevel", null, 
                            ["number"], 
                            [level]
                            );
            });
    }

    /*
    LIBLOUIS_API
int EXPORT_CALL
lou_translateString(const char *tableList, const widechar *inbuf, int *inlen,
		widechar *outbuf, int *outlen, formtype *typeform, char *spacing, int mode);
    */
        function wrap_lou_translate_string (module)
        {
            /*
            return ((tablelist, inStr, outStr, outmaxlen, typeform,spacing, mode ) => {
    
                let ptr_table = module._malloc ((tablelist.length + 4));
                let ptr_in = module._malloc ((inStr.length + 4) * 4);
                let outsize = outmaxlen === -1 ? (inStr.length + 4) * 4 * 2 : outmaxlen;

                let ptr_out = module._malloc (outsize);
                module.stringToUTF32(inStr, ptr_in, (inStr.length + 4) * 4);
                module.stringToASCII(tablelist, ptr_table)
                let result = module.ccall ("unicode_translate_string", "number", ["number", "number", "number", "number"], 
                                        [ptr_table, 
                                            ptr_in, (inStr.length + 4), 
                                            ptr_out, outmaxlen]
                                        );
                module._free (ptr);                            
                let error = module.ccall ("unicode_translate_get_status", "number", [], 
                                        []
                                        );
                let rstr = "";
                
                if (error === 1)
                {
                  rstr=module.UTF32ToString (result, (len + 4) * 8);
                }
                else
                  rstr ="Error while translating " + error.toString()  
                
                module._free(result);
                return (rstr);
              });
              */
        }
    
    function wrap_get_table_nbr(module)
    {
        return (() => {
    
            let result = module.ccall ("loureact_get_table_nbr", "number", 
                            [], 
                            []
                            );
            return (result);
            });
    }

    function wrap_lou_stack_free(module)
    {
        return (() => {
    
            let result = module.ccall ("loureact_get_stack_free", "number", 
                            [], 
                            []
                            );
            return (result);
            });
    }

    function wrap_get_table_fname(module)
    {
        return ((i) => {
    
            let result = module.ccall ("loureact_get_table_fname", "number", 
                            ["number"], 
                            [i]
                            );
            let str = module.AsciiToString (result);

            
            return (str);
            });
    }

    function wrap_get_table_description(module)
    {
        return ((i) => {
    
            let result = module.ccall ("loureact_get_table_description", "number", 
                            ["number"], 
                            [i]
                            );
            let str = module.AsciiToString (result);
            
            
            return (str);
            });
    }

    function wrap_get_table_lang(module)
    {
        return ((i) => {
            
            let result = module.ccall ("loureact_get_table_lang", "number", 
                            ["number"], 
                            [i]
                            );
            let str = module.AsciiToString (result);

            
            return (str);
            });
    }
    function wrap_get_table_region(module)
    {
        return ((i) => {
            
            let result = module.ccall ("loureact_get_table_region", "number", 
                            ["number"], 
                            [i]
                            );
            let str = module.AsciiToString (result);

            
            return (str);
            });
    }

    function wrap_get_table_flags(module)
    {
        return ((i) => {
    
            let result = module.ccall ("loureact_get_table_flags", "number", 
                            ["number"], 
                            [i]
                            );
            let str = module.AsciiToString (result);

            
            return (str);
            });
    }
class libLouis 
{
    constructor ()
    {
        this.ready = false;
        this.f_loureact_get_table_nbr = null;
        this.f_loureact_get_table_fname = null;
        this.f_loureact_get_table_description = null;
        this.f_loureact_get_table_lang = null;
        this.f_loureact_get_table_region = null;
        this.f_loureact_get_table_flags = null;
        this.f_lou_char_size = null;
        this.f_lou_check_table = null;
        this.f_lou_compile_string = null;
        this.f_get_type_form_for_emph_class = null;
        this.f_set_log_level = null;
        this.f_lou_translate_string = null;
        this.f_lou_stack_free = null;
        this.table_nbr = 0;
        this.display_nbr = 0;
        this.module = null;
    }
    isInit ()
    {
        if (this.module)
            return true;
        return false;    
    }
    
    

    load (callback)
    {
        createModule().then((Module) => {
            
            this.init (Module);
            console.log ("liblouisreact loaded");
            callback(true);
            
          }).catch ((error)=> {
            console.log(error);
            alert(error);
          });
    }
    init (module)
    {
        this.module = module;
        this.f_loureact_get_table_nbr = wrap_get_table_nbr(module);
        this.f_loureact_get_table_fname = wrap_get_table_fname(module);
        this.f_loureact_get_table_description = wrap_get_table_description(module);
        this.f_loureact_get_table_lang = wrap_get_table_lang(module);
        this.f_loureact_get_table_region = wrap_get_table_region(module);
        this.f_loureact_get_table_flags = wrap_get_table_flags(module);
        this.f_unicode_translate_string = wrap_unicode_translate_string(module);
        this.f_lou_free = wrap_lou_free (module);
        this.f_lou_check_table = wrap_lou_checkTable (module);
        this.f_lou_char_size = wrap_lou_char_size(module);
        this.f_lou_compile_string = wrap_lou_compile_string (module);
        this.f_get_type_form_for_emph_class = wrap_getTypeformForEmphClass (module);
        this.f_set_log_level = wrap_set_log_level (module);
        this.f_lou_translate_string = wrap_lou_translate_string(module);
        this.f_lou_stack_free = wrap_lou_stack_free(module);
    }

    get_table_nbr ()
    {
        if (this.f_loureact_get_table_nbr)
        {
            this.table_nbr = this.f_loureact_get_table_nbr ()
            return this.table_nbr;
        }
        return 0
    }
    get_table_fname (i)
    {
        if (this.f_loureact_get_table_fname && i < this.table_nbr)
        {
            return this.f_loureact_get_table_fname (i);
        }
        return "";
    }
    get_table_description (i)
    {
        if (this.f_loureact_get_table_description && i < this.table_nbr)
        {
            return this.f_loureact_get_table_description (i);
        }
        return "";
    }
    get_table_lang (i)
    {
        if (this.f_loureact_get_table_lang && i < this.table_nbr)
        {
            return this.f_loureact_get_table_lang (i);
        }
        return "";
    }
    get_table_region (i)
    {
        if (this.f_loureact_get_table_region && i < this.table_nbr)
        {
            return this.f_loureact_get_table_region (i);
        }
        return "";
    }

    get_table_flags (i)
    {
        if (this.f_loureact_get_table_flags && i < this.table_nbr)
        {
            return this.f_loureact_get_table_flags (i);
        }
        return 0;
    }
    unicode_translate_string(str, tableid)
    {
        if (this.f_unicode_translate_string)
        {
            return this.f_unicode_translate_string (str, tableid);
        }
        return "";
    }


    lou_free (i)
    {
        if (this.f_lou_free)
        {
            return this.f_lou_free ();
        }
        return 0;
    }

    lou_charSize()
    {
        if (this.f_lou_char_size)
        {
            return this.f_lou_char_size();
        }
        return (0);
    }

    lou_checkTable (str)
    {
        if (this.f_lou_check_table)
        {
            return this.f_lou_check_table (str);
        }    
        return -1;
    }
    lou_compileString (strtable, instring)
    {
        if (this.f_lou_compile_string)
        {
            return (this.f_lou_compile_string(strtable, instring));
        }
        return -1;
    }
    lou_getTypeformForEmphClass (tablelist, emphClass)
    {
        if (this.f_get_type_form_for_emph_class)
            return this.f_get_type_form_for_emph_class (tablelist, emphClass);
        return (-1);
    }
    lou_setLogLevel (level)
    {
        if (this.f_set_log_level)
            this.f_set_log_level (level);
    }
    lou_get_stack_free ()
    {
        if (this.f_lou_stack_free)
            return (this.f_lou_stack_free())
        return 0;
    }
}

export default libLouis;