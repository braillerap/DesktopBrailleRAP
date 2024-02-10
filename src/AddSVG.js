import {useState, useContext } from 'react';
import AppContext from "./AppContext";

const AddSVG = () => {
    const [file, setFile] = useState();
    const {GetImportSVG} = useContext(AppContext);

    const handleFileChange = (e) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
          let f = GetImportSVG();
          console.log ("svg import:" + f);
          if (f)
          { 
            
            console.log ("call import svg");
            f(e.target.files[0]);
          }
        }
      };
    
     
    return (
    <>
        <h3>Import de graphique SVG</h3>
        
        <div>
        <input type="file" onChange={handleFileChange} className='pure-button'  accept={ "image/svg+xml" } />

        <div>{file && `${file.name} - ${file.type} - ${file}`}</div>

        
        </div>
    </>
    );
  };
  
  export default AddSVG;