import { useState, useContext} from 'react';
import AppContext from "./AppContext";
import FileSaver from 'file-saver';
const File = (props) => {

    const { GetPaperCanvas} = useContext(AppContext);
    let fileinput = null;

    const handleSave = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv )
        {
            let data = canv.exportJSON();
            if (props.webviewready === false)
            {
                let blob = new Blob([data], { type: "application/json;charset=utf-8" });
                FileSaver.saveAs(blob, "page.json");
            }
            else
            {
                let blob = new Blob([data], { type: "application/json;charset=utf-8" });
                FileSaver.saveAs(blob, "page.json");
            }
            
        }   
    };
    const handleSaveAs = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv && props.webviewready)
        {
            
        }   
    };
    const handleLoad = (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv && props.webviewready)
        {
            
        }   
    };

    const handleFileRead = () => {
        let canv = GetPaperCanvas();
        if (fileinput && canv) 
        {
            console.log("call import json :" + fileinput.result);
            canv.importJSON(fileinput.result);
        }
    }
    const handleFileChange = (e) => {
        let canv = GetPaperCanvas();
        fileinput = new FileReader();
        fileinput.onload = handleFileRead;
        fileinput.readAsText(e.target.files[0]);
    };
    const condclass = props.webviewready === true ? "" : "pure-button-disabled";
    console.log ("condclass " + condclass);
    return (


        <>
            

                
                <div className='div_column'>
                <div className="Group">
                    <h3>Enregistrer</h3>
                    <button onClick={handleSave} className={`pure-button    `}>Enregistrer...</button>
                    &nbsp;
                    <button onClick={handleSaveAs} className={`pure-button ${condclass}`}>Enregistrer sous...</button>
                </div>
                <div className="Group">
                    <h3>Ouvrir</h3>
                    <button onClick={handleLoad} className={`pure-button ${condclass}`}>Ouvrir...</button>
                    <input type="file" onChange={handleFileChange} className='pure-button'/>
                </div>
                </div>
        </>
    );
};

export default File;