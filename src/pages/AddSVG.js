import { useState, useContext } from 'react';
import AppContext from "../components/AppContext";

const AddSVG = (props) => {
  const [file, setFile] = useState();
  const { GetImportSVG, GetPaperCanvas, GetLocaleString, PyWebViewReady} = useContext(AppContext);

  const handleLoad = async (e) => {
    e.stopPropagation();

    let canv = GetPaperCanvas();
    if (canv && PyWebViewReady) {
      e.preventDefault();

      let dialogtitle = GetLocaleString ("svg.open"); //"Ouvrir"
      let filter = [
        GetLocaleString ("file.svgfile"), //"Fichier SVG",
        GetLocaleString ("file.all"), //"Tous"
      ]
      let types = [
        "(*.svg)",
        "(*.*)"
      ]

      let ret = await window.pywebview.api.import_file(dialogtitle, filter, types);
      console.log(ret);
      if (ret.length > 0) {
        let data = JSON.parse(ret);
        canv.importSvg(data.data);
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      let f = GetImportSVG();
      let p = GetPaperCanvas();
      
      //console.log("svg import:" + f);
      if (p)
      {
        p.importSvg(e.target.files[0]);
      }
      else if (f) {
        f(e.target.files[0]);
      }
    }
  };

  return (
    <>
      <h3>{GetLocaleString("svg.import")}</h3>

      <div>
        {PyWebViewReady === false &&
          <>
            <p>backend mock</p>
            <input type="file" onChange={handleFileChange} className='pure-button' accept={"image/svg+xml"} />
            <div>
              {file && `${file.name} - ${file.type} - ${file}`}
            </div>
          </>

        }
        <button onClick={handleLoad} className={`pure-button `}>{GetLocaleString("svg.importfile")}...</button>

      </div>
    </>
  );
};

export default AddSVG;