import { useContext, useState} from 'react'
import AppContext from "./AppContext";

const Parameters = () => {
  const { GetPaper } = useContext(AppContext);
  const [PaperWidth, setPaperWidth] = useState(210);
  const [PaperHeight, setPaperHeight] = useState(297);
  const [UsableWidth, setUsableWidth] = useState(190);
  const [UsableHeight, setUsableHeight] = useState(250);
  const [SvgInterpol, setSvgInterpol] = useState(false);
  const [data, setData] = useState([]);
  const [Options, setOptions] = useState({});
  const brailleinfo = [];
  const handleChangePort = () => {

  }

  const handleChangeBraille = () => {

  }

  const render_comport = () => {
      if (data === null)
        return (
          <p>Aucun port de communication</p>
        );
      else if (data.length === 0)
        return (
        <p>Aucun port de communication</p>
            );
      else  
      { 
        
        return (
        <>
        <p>
          Port de communication 
            <b>{Options.comport}</b>
        </p>
        <label htmlFor='selectport'>
          Port de communication
        </label>
        <select 
            className='selectbraille' 
            onChange={handleChangePort}  
            value={Options.comport} 
            id="selectport"
            name="selectport">    
         
        {data.map ((line, index)=> {
                  if (line.device === Options.comport)
                    return (<option   key={line.device} value={line.device}>{line.device} {line.description} </option>);
                  else
                    return (<option   key={line.device} value={line.device}>{line.device} {line.description} </option>);
               })
        }     
        </select>
        </>
        );
      }
    }
    const render_braille_lang = () => {
      if (brailleinfo.length === 0)
      {
        return (<p>Aucune table de transcription </p>)
      }
      let selectedtable ="vide";
      if (Options.brailletbl < brailleinfo.length)
        selectedtable = brailleinfo[Options.brailletbl].desc;
      return (
        <>
        <p>
          Table de transcription  
          <b>{selectedtable}</b>
        </p>
        <label htmlFor='combobraille'>
            Table Braille
          </label>
        <select className='selectbraille' 
            onChange={handleChangeBraille}  
            value={Options.brailletbl} 
            name="combobraille"
            id="combobraille"
           
           >
           
        
        {brailleinfo.map ((item, index)=> {
                 if (index === Options.brailletbl)
                   return (<option   key={index} value={index}>{item.lang + " - " + item.desc }</option>);
                 else
                   return (<option   key={index} value={index}>{item.lang + " - " + item.desc }</option>);
              })
             }
                   
        </select>
        
        </>
       );

    }  
  return (
    <>

      <h3>Paramètres</h3>
      
      <div className="container">
      <div className="Group">
                    <h3>Taille du papier (mm)</h3>
                    <p>
                        <label>
                            Largeur Papier:&nbsp; 
                            <input type="number"  
                                min={100}
                                max={420}
                                defaultValue={PaperWidth} 
                                name="myInputW" 
                                onChange={(e) => { setPaperWidth(e.target.value) }} 
                                style={{ width: "rem" }}
                            />
                        </label>
                    </p>
                    <p>
                        <label>
                            Hauteur Papier: <input type="number"  
                                min={100}
                                max={550}
                                defaultValue={PaperHeight} 
                                name="myInputH" 
                                onChange={(e) => { setPaperHeight(e.target.value) }} 
                                style={{ width: "4em" }}
                                />
                        </label>
                    </p>
                    <p>
                        <label>
                            Largeur Utile:&nbsp; 
                            <input type="number"  
                                min={100}
                                max={420}
                                defaultValue={UsableWidth} 
                                name="myInputWU" 
                                onChange={(e) => { setUsableWidth(e.target.value) }} 
                                style={{ width: "4em" }}
                            />
                        </label>
                    </p>
                    <p>
                        <label>
                            Hauteur Utile:&nbsp;  
                            <input type="number"  
                                min={100}
                                max={550}
                                defaultValue={UsableHeight} 
                                name="myInputHU" 
                                onChange={(e) => { setUsableHeight(e.target.value) }} 
                                style={{ width: "4em" }}
                                />
                        </label>
                    </p>
                    
                </div>
                <div className="Group">
                    <label>
                        Interpolation Chemin (Path):&nbsp;
                <input type="checkbox"
                    label="Interpolation des chemins SVG"
                    checked={SvgInterpol}
                        onChange={(e) => { setSvgInterpol(e.target.checked) }}
                        key="svginterpol"
                />
                </label>
                </div>
        
                <div className='Group'>
                {render_braille_lang()}
        
                </div>
                <div className='Group'>
        
        {render_comport()}
                </div>
      </div>

    </>
  );

};

export default Parameters;