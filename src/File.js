import { useContext} from 'react';
import AppContext from "./AppContext";
import FileSaver from 'file-saver';
const File = (props) => {

    const { GetPaperCanvas} = useContext(AppContext);
    let fileinput = null;

    const handleSave = async (e) => {
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
                e.preventDefault();

                console.log(window.pywebview);
                //window.pywebview.api.fullscreen();
          
          
                let dialogtitle = "Enregistrer";
                let filter = [
                  "Fichier desktop",
                  "Tous"
                ]
          
                await window.pywebview.api.save_file (data, dialogtitle, filter);
                // TODO: dsplay error to user
            }
            
        }   
    };
    const handleSaveAs = async (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv && props.webviewready)
        {
            e.preventDefault();
            let data = canv.exportJSON();
            console.log(window.pywebview);
            //window.pywebview.api.fullscreen();
      
      
            let dialogtitle = "Enregistrer sous...";
            let filter = [
              "Fichier desktop",
              "Tous"
            ]
      
            window.pywebview.api.saveas_file (data, dialogtitle, filter);
            // TODO: display error to the user
        }   
    };
    const handleLoad = async (e) => {
        e.stopPropagation();
        
        let canv = GetPaperCanvas();
        if (canv && props.webviewready)
        {
            e.preventDefault();

            let dialogtitle = "Ouvrir"
            let filter = [
              "Fichier Desktop",
              "Tous"
            ]
            let ret = await window.pywebview.api.load_file (dialogtitle, filter);
            console.log (ret);
            if (ret.length > 0)
            {
                let data = JSON.parse(ret);
                canv.importJSON(data.data);
            }
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
        fileinput = new FileReader();
        fileinput.onload = handleFileRead;
        fileinput.readAsText(e.target.files[0]);
    };
    const testDeleteFrame = (e) => {
        e.stopPropagation();
        let canv = GetPaperCanvas();
        if (canv) 
        {
            console.log("test deleteframe :");
            canv.deleteFrame ();
        }
    }
    const renderDebug = (render) => {
        if (render !== "true")
            return (<></>);

        return (
            <div className='div_column'>
                <button onClick={testDeleteFrame} className={`pure-button ${condclass}`}>Test frame</button>
            </div>
        );
    }
    // TODO: change using backend from props to context
    const condclass = props.webviewready === true ? "" : "pure-button-disabled";
    
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
                        {props.webviewready === false && <input type="file" onChange={handleFileChange} className='pure-button'/>}
                    </div>
                
                </div>
                {renderDebug(`${process.env.REACT_APP_FEATURES_FOR_DEBUG}`)}
                
        </>
    );
};

export default File;