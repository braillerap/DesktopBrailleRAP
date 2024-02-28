import { useState, useContext } from 'react';
import AppContext from "./AppContext";

const AddSVG = (props) => {
  const [file, setFile] = useState();
  const { GetImportSVG, GetPaperCanvas } = useContext(AppContext);

  const handleLoad = async (e) => {
    e.stopPropagation();

    let canv = GetPaperCanvas();
    if (canv && props.webviewready) {
      e.preventDefault();

      let dialogtitle = "Ouvrir"
      let filter = [
        "Fichier SVG",
        "Tous"
      ]
      let types = [
        "(*.svg)",
        "(*.*)"
      ]

      let ret = await window.pywebview.api.load_file(dialogtitle, filter, types);
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
      console.log("svg import:" + f);
      if (f) {

        console.log("call import svg");
        f(e.target.files[0]);
      }
    }
  };


  return (
    <>
      <h3>Import de graphique SVG</h3>

      <div>
        {props.pywebview === false &&
          <>
            <input type="file" onChange={handleFileChange} className='pure-button' accept={"image/svg+xml"} />
            <div>
              {file && `${file.name} - ${file.type} - ${file}`}
            </div>
          </>

        }
        <button onClick={handleLoad} className={`pure-button `}>Importer...</button>

      </div>
    </>
  );
};

export default AddSVG;