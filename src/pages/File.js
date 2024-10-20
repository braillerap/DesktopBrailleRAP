import { useContext } from 'react';
import AppContext from "../components/AppContext";
import FileSaver from 'file-saver';
const File = (props) => {

    const { GetPaperCanvas, GetLocaleString, PyWebViewReady} = useContext(AppContext);
    let fileinput = null;

    const handleSave = async (e) => {
        e.stopPropagation();

        let canv = GetPaperCanvas();
        if (canv) {
            let data = canv.exportJSON();
            if (PyWebViewReady === false) {
                let blob = new Blob([data], { type: "application/json;charset=utf-8" });
                FileSaver.saveAs(blob, "page.json");
            }
            else {
                e.preventDefault();

                //console.log(window.pywebview);
                //window.pywebview.api.fullscreen();


                let dialogtitle = GetLocaleString("file.save"); //"Enregistrer";
                let filter = [
                    GetLocaleString("file.desktopfile"),     //"Fichier desktop",
                    GetLocaleString("file.all")              //"Tous"
                ]

                await window.pywebview.api.save_file(data, dialogtitle, filter);
                // TODO: dsplay error to user
            }

        }
    };
    const handleSaveAs = async (e) => {
        e.stopPropagation();

        let canv = GetPaperCanvas();
        if (canv && PyWebViewReady) {
            e.preventDefault();
            let data = canv.exportJSON();
            //console.log(window.pywebview);
            //window.pywebview.api.fullscreen();


            let dialogtitle = GetLocaleString("file.saveas"); //"Enregistrer sous...";
            let filter = [
                GetLocaleString("file.desktopfile"), //"Fichier desktop",
                GetLocaleString("file.all") //"Tous"
            ]

            window.pywebview.api.saveas_file(data, dialogtitle, filter);
            // TODO: display error to the user
        }
    };
    const handleLoad = async (e) => {
        e.stopPropagation();

        let canv = GetPaperCanvas();
        if (canv && PyWebViewReady) {
            e.preventDefault();

            let dialogtitle = GetLocaleString("file.open"); //"Ouvrir"
            let filter = [
                GetLocaleString("file.desktopfile"), //"Fichier Desktop",
                GetLocaleString("file.all")//Tous"
            ]
            let ret = await window.pywebview.api.load_file(dialogtitle, filter);
            
            
            if (ret.length > 0) {
                let data = JSON.parse(ret);
                //console.log (data.data.length);
                if (data.data.length > 0)
                    canv.importJSON(data.data);
            }
        }
    };

    const handleFileRead = () => {
        let canv = GetPaperCanvas();
        if (fileinput && canv) {
            //console.log("call import json :" + fileinput.result);
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
        if (canv) {
            //console.log("test deleteframe :");
            canv.deleteFrame();
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
    const condclass = PyWebViewReady === true ? "" : "pure-button-disabled";

    return (
        <>
            <div className='div_column'>
                <div className="Group">
                    <h3>{GetLocaleString("file.save")}</h3>
                    <button onClick={handleSave} className={`pure-button    `}>{GetLocaleString("file.save")}...</button>
                    &nbsp;
                    <button onClick={handleSaveAs} className={`pure-button ${condclass}`}>{GetLocaleString("file.saveas")}...</button>
                </div>
                <div className="Group">
                    <h3>{GetLocaleString("file.open")}</h3>
                    <button onClick={handleLoad} className={`pure-button ${condclass}`}>{GetLocaleString("file.open")}...</button>
                    {PyWebViewReady === false && <input type="file" onChange={handleFileChange} className='pure-button' />}
                </div>

            </div>
            

        </>
    );
};

export default File;