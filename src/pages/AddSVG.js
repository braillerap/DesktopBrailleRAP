import React from 'react';
import AppContext from "../components/AppContext";


class AddSVG extends React.Component {
    static contextType = AppContext;  

    constructor(props) {
      super(props);
      this.state = {
          file: null,
      }
      
      this.handleLoad = this.handleLoad.bind(this);
      this.handleFileChange = this.handleFileChange.bind(this);
    }
    async componentDidMount() {
      // TODO get backend from context not prop
   
      this.context.ForceResize ();
    }
    /*
  const [file, setFile] = useState();
  const { GetImportSVG, GetPaperCanvas, GetLocaleString, PyWebViewReady, ForceResize} = useContext(AppContext);
*/
  async handleLoad (e) {
    e.stopPropagation();

    let canv = this.context.GetPaperCanvas();
    if (canv && this.context.PyWebViewReady) {
      e.preventDefault();

      let dialogtitle = this.context.GetLocaleString ("svg.open"); //"Ouvrir"
      let filter = [
        this.context.GetLocaleString ("file.svgfile"), //"Fichier SVG",
        this.context.GetLocaleString ("file.all"), //"Tous"
      ]
      let types = [
        "(*.svg)",
        "(*.*)"
      ]

      let ret = await window.pywebview.api.import_file(dialogtitle, filter, types);
      //console.log(ret);
      if (ret.length > 0) {
        let data = JSON.parse(ret);
        console.log ("data.fname " + data.fname);
        canv.importSvg(data.data, data.fname);
      }
    }
  }

  handleFileChange  (e)  
  {
    if (e.target.files) {
      this.setState({file: e.target.files[0]});
      let f = this.context.GetImportSVG();
      let p = this.context.GetPaperCanvas();
      
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
  
  
  render ()
  {
    return (
      <>
        <h3>{this.context.GetLocaleString("svg.import")}</h3>
        <h2></h2>
        <div>
          {this.context.PyWebViewReady === false &&
            <>
              <p>backend mock</p>
              <input type="file" onChange={this.handleFileChange} className='pure-button' accept={"image/svg+xml"} />
              <div>
                {this.state.file && `${this.state.file.name} - ${this.state.file.type} - ${this.state.file}`}
              </div>
            </>
          }
          
          <button onClick={this.handleLoad} className={`pure-button `}>{this.context.GetLocaleString("svg.importfile")}...</button>
          
        </div>
      </>
    );
  }
};

export default AddSVG;