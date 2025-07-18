import React from 'react';
import AppContext from '../components/AppContext';
import paper from 'paper';
import GeomToGCode from '../braillegeometry/GeomToGCode';
import Modal from 'react-modal'
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa6";

import PageBuilder from '../braillegeometry/PageBuilder.js';
import PatternStrategy from '../components/patternstrategy.js';
import dashstroke from '../patterns/dashstroke.js';
import logo2 from '../833.gif'

class Print extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      comevent: "",
      printstatus: "",
      cancelprint: false,
      rightdim:[0,0],
      buildstatus:"",
      pendingbuild:false
    };

    this.canvasRef = React.createRef();

    this.ptcloud = [];
    
    this.HandleDownload = this.HandleDownload.bind(this);
    this.HandleRefresh = this.HandleRefresh.bind(this);
    this.HandlePrint = this.HandlePrint.bind(this);
    this.CancelPrint = this.CancelPrint.bind(this);

    
    this.resize = this.resize.bind(this);
    this.counter = 0;

    //this.isConditionPrint = process.env.REACT_APP_START_PRINT === "true";
    //this.isConditionImport = !!process.env.REACT_APP_START_SVG;

    
  }

  componentDidMount() {

    //paper.setup(canvasRef.current);
    this.paper = new paper.PaperScope();
    this.paper.setup(this.canvasRef.current);

    this.paper.settings.insertItems = false;
    this.paper.settings.handleSize = 8;
    // read runtime option
    console.log ("read runtime options");
    let runtime = this.context.GetRuntimeOptions();
    if (runtime.path_svg !== "" && runtime.path_patterns !== "") {
      // load patterns and svg
      this.isConditionImport = true;
    }
    if (runtime.direct_print === "true" || runtime.direct_print === "1") {
      // direct print on configured port
      this.isConditionPrint = true;
    }
    if (this.isConditionImport) {
      this.initPaper();
      this.loadSVGAndPatterns ();

      

      //this.loadSvgToPrint();
      //this.loadPatternToPrint();
      this.buildpagedelay(() => {
        // load options only once
        runtime.path_svg = "";
        runtime.path_patterns = "";
        if (this.isConditionPrint) {
          console.log("buildpagedelay terminé, lancement de HandlePrint..."); 
          this.HandlePrint();
          runtime.direct_print ="false"; //disable auto print to print only once
        }
        });
    }
    else {
      this.initPaper();
      this.buildpagedelay();
    }
  }
  componentWillUnmount() {
    
    if (this.timer)
      clearTimeout(this.timer);
    if (this.timerbuild)
      clearTimeout(this.timerbuild);
    //workerinstance.terminate();
    
  }
  loadSVGAndPatterns () {
    let runtime = this.context.GetRuntimeOptions();
    let pattern_namefile=runtime.path_patterns;
    console.log("load pattern name file " + pattern_namefile);
    if (pattern_namefile === undefined || pattern_namefile === null || pattern_namefile.length === 0) {
      console.error("No pattern file provided for printing.");
      return;
    }
    let svg_namefile=runtime.path_svg;
    console.log("load svg name file " + svg_namefile);
    if (svg_namefile === undefined || svg_namefile === null || svg_namefile.length === 0) {
      console.error("No SVG file provided for printing.");
      return;
    }
    window.pywebview.api.read_file(pattern_namefile).then((jsonpattern) => {
      const canvas = this.context.GetPaperCanvas();
      if (canvas) {
        let pattern_string = JSON.parse(jsonpattern);
        let data = JSON.parse(pattern_string.data);
        this.setState({fillcolorlist:data.state.fillcolorlist});
        this.setState({strokecolorlist:data.state.strokecolorlist});
        this.context.setPatternAssoc(data.assoc.PatternAssoc);
        this.context.setPatternStrokeAssoc(data.assoc.PatternStrokeAssoc);
        this.context.setDashStrokeStyleAssoc(data.assoc.DashStrokeStyleAssoc);
        this.context.setPatternFillRule(data.status.PatternFillRule);
        this.context.setForceEdgeRule(data.status.ForceEdgeRule);
      } else {
        console.warn("Canvas not found.");
      }
      window.pywebview.api.read_file(svg_namefile).then((svg) => {
        const canvas = this.context.GetPaperCanvas();
        if (canvas) {
          let svg_string = JSON.parse(svg);
          canvas.importSvg(svg_string.data, "ex.svg");
        } else {
          console.warn("Canvas introuvable.");
        }
      }).catch((error) => {
        console.error("Error loading SVG:", error);
      });


    }).catch((error) => {
      console.error("Error loading patterns:", error);
    });
  }
  loadPatternToPrint() {
    let pattern_namefile=process.env.REACT_APP_START_PATTERN;
    console.log("load pattern name file " + pattern_namefile);
    if (pattern_namefile === undefined || pattern_namefile === null || pattern_namefile.length === 0) {
      console.error("No pattern file provided for printing.");
      return;
    }
    window.pywebview.api.read_file(pattern_namefile).then((jsonpattern) => {
      const canvas = this.context.GetPaperCanvas();
      if (canvas) {
        let pattern_string = JSON.parse(jsonpattern);
        let data = JSON.parse(pattern_string.data);
        this.setState({fillcolorlist:data.state.fillcolorlist});
        this.setState({strokecolorlist:data.state.strokecolorlist});
        this.context.setPatternAssoc(data.assoc.PatternAssoc);
        this.context.setPatternStrokeAssoc(data.assoc.PatternStrokeAssoc);
        this.context.setDashStrokeStyleAssoc(data.assoc.DashStrokeStyleAssoc);
        this.context.setPatternFillRule(data.status.PatternFillRule);
        this.context.setForceEdgeRule(data.status.ForceEdgeRule);
      } else {
        console.warn("Canvas introuvable.");
      }
      
    }
    ).catch((error) => {
      console.error("Error loading SVG:", error);
    });
  }

  loadSvgToPrint() {
    //let svg_namefile="/home/pissard/Downloads/enbosse_files/12semaines_segmented.svg"
    let svg_namefile=process.env.REACT_APP_START_SVG;
    console.log("load svg name file " + svg_namefile);
    if (svg_namefile === undefined || svg_namefile === null || svg_namefile.length === 0) {
      console.error("No SVG file provided for printing.");
      return;
    }
    window.pywebview.api.read_file(svg_namefile).then((svg) => {
      const canvas = this.context.GetPaperCanvas();
      if (canvas) {
        let svg_string = JSON.parse(svg);
        canvas.importSvg(svg_string.data, "ex.svg");
      } else {
        console.warn("Canvas introuvable.");
      }
    }
    ).catch((error) => {
      console.error("Error loading SVG:", error);
    });
  }

  initPaper() {
    let canvasWidth = this.canvasRef.current.offsetWidth /*/ window.devicePixelRatio*/;
    let canvasHeight = this.canvasRef.current.offsetHeight /*/ window.devicePixelRatio*/;
    let xratio = canvasWidth / this.context.Params.Paper.width;
    let yratio = canvasHeight / this.context.Params.Paper.height;
    let pixelMillimeterRatio = Math.min(xratio, yratio);
    
    //let pixelMillimeterRatio = Math.min(canvasWidth / this.context.Params.Paper.width, canvasHeight / this.context.Params.Paper.height);
    //console.log("canvas width " + this.canvasRef.current.offsetWidth + " height "+ this.canvasRef.current.offsetHeight);
    //console.log("win ratio " + window.devicePixelRatio);
    //console.log("pix ratio:" + pixelMillimeterRatio);

    this.paper.project.activeLayer.applyMatrix = false;
    //console.log("paper ratio ratio " + this.paper.project.activeLayer.scaling);
    this.paper.project.activeLayer.scaling = pixelMillimeterRatio;
    //console.log("paper ratio  " + this.paper.project.activeLayer.scaling);
    this.paper.project.activeLayer.pivot = this.paper.project.activeLayer.bounds.center;
    this.paper.view.viewSize = [canvasWidth, canvasHeight];
    this.zoom = 1;
    this.pixelRatio = pixelMillimeterRatio;
    this.setState({rightdim:[this.canvasRef.current.offsetWidth,this.canvasRef.current.offsetHeight]});
    let bounds = new this.paper.Path.Rectangle(0, 0, this.context.Params.Paper.width, this.context.Params.Paper.height);
    bounds.name = "Paper";
    bounds.strokeWidth = 1;
    bounds.strokeColor = 'black';
    bounds.scaling = 1;
    bounds.strokeScaling = false;
    this.paper.project.activeLayer.addChild(bounds);

    let bounds2 = new this.paper.Path.Rectangle(0, 0, this.context.Params.Paper.usablewidth, this.context.Params.Paper.usableheight);
    bounds2.name = "Usable";
    bounds2.strokeWidth = 1;
    bounds2.strokeColor = 'red';
    bounds2.scaling = 1;
    bounds2.strokeScaling = false;
    this.paper.project.activeLayer.addChild(bounds2);

    


  }

  resize() {
    this.setState({"dimension":[this.canvasRef.current.offsetWidth,this.canvasRef.current.offsetHeight]});
    return;

  }
  

  
  buildpagedelay (callback)
  {
    this.setState({buildstatus:this.context.GetLocaleString("pattern.status.build")});
    this.setState({pendingbuild:true});
    this.timerbuild = setInterval(() => {
      this.buildpagetempo();
      if (callback) {
        callback();
      }
    }, 125);
  }

  buildpagetempo() {
    let begin = performance.now ();
    
    if (this.timerbuild)
      clearTimeout(this.timerbuild);
    this.buildpage ();  
    this.setState({buildstatus:this.context.GetLocaleString("pattern.status.preview")});
    this.setState({pendingbuild:false});
    let end = performance.now ();
    
    console.log ("buildpage took " + (end-begin) + " ms");
  }

  displaydotpreview (dots)
  {
    // display dots on preview
    for (let i = 0; i < dots.length; i++) {
      let dot = new this.paper.Path.Circle(new this.paper.Point(dots[i].x, dots[i].y), 0.25);
      dot.strokeWidth = 1;
      dot.strokeColor = 'black';
      dot.scaling = 1;
      dot.strokeScaling = false;
      dot.fillColor = 'black';
      this.paper.project.activeLayer.addChild(dot);
    }
  }
  buildpage()
  {
    let canv = this.context.GetPaperCanvas();
    

    if (canv) {
      console.log ("buildpage:canvas found");
      let patternsvg = canv.getpatternsvg();
      
      let patstrategy = new PatternStrategy();
      let strokestrategy = new PatternStrategy();

      patstrategy.setPatternAssociationDict(
        this.context.PatternFillRule === 0 ? this.context.PatternAssoc : this.context.PatternStrokeAssoc
      );
      
      strokestrategy.setPatternAssociationDict (this.context.DashStrokeStyleAssoc);
      console.log ("buildpage:setPatternAssociationDict", this.context.PatternFillRule);
      //load patterns if needed
      if (patternsvg.length === 0 && patstrategy.isStrategyValid ())
      {
        canv.loadPatterns();
        patternsvg = canv.getpatternsvg();
      }

      console.log ("construct page builder");
      let builder = new PageBuilder (
            this.context.GetPaper(),
            canv, 
            patternsvg, 
            patstrategy, 
            this.context.Params, 
            this.context.GetBrailleReverse(), 
            this.context.PatternFillRule,
            this.props.louis,
            dashstroke,
            strokestrategy,
            this.context.ForceEdgeRule
          );
      
      
      console.log ("run page builder");
      this.ptcloud = builder.buildpage ();  // save dots for printing
      console.log (this.ptcloud);
      this.displaydotpreview(this.ptcloud);
    }
  }

  HandleRefresh() {
    
    this.paper.project.clear();
    this.initPaper();
    this.buildpagedelay();
  }
  async HandleDownload() {
    console.log ("download request");
    if (this.ptcloud.length > 0) {
      let gcoder = new GeomToGCode(this.context.Params.Speed,
        this.context.Params.Accel);
      // generate GCODE
      gcoder.GeomToGCode(this.ptcloud, this.context.Params.Paper.height);
      let gcode = gcoder.GetGcode();
      console.log (gcode);

      /*
      // write gcode in file
      let blob = new Blob([gcode], { type: "text/plain;charset=utf-8" });

      // "download" the gcode file
      // TODO : pass the gcode to python backend
      console.log ("start download");
      FileSaver.saveAs(blob, "braille.gcode");
      */
      // use backend to save file
      if (this.context.PyWebViewReady === true) 
      {
        let dialogtitle = this.context.GetLocaleString("file.saveas"); //"Enregistrer sous";
        let filter = [
          this.context.GetLocaleString ("file.gcodefile"), //"Fichier gcode",
          this.context.GetLocaleString ("file.all"), //"Tous"
        ]
        let types = [
          "(*.gcode)",
          "(*.*)"
        ]

        await window.pywebview.api.download_file(gcode, dialogtitle, filter, types);
      }
    }
  }
  HandlePrint() {

    if (this.ptcloud.length > 0 && this.context.PyWebViewReady === true) {
      let gcoder = new GeomToGCode(this.context.Params.Speed,
        this.context.Params.Accel);
      gcoder.GeomToGCode(this.ptcloud, this.context.Params.Paper.height);
      let gcode = gcoder.GetGcode();

      this.setState({ comevent: "" });
      this.setState({ showModal: true, cancelprint: false });

      // request backend to print gcode
      window.pywebview.api.PrintGcode(gcode, this.context.Params.comport).then(status => {
        // remove modal status screen
        this.setState({ showModal: false, printstatus: status });

        // set a timer to call setstate with a little delay
        // because form change are disabled for screen reader due to
        // modal status box
        this.timer = setInterval(() => {
          this.StatusPrintEnd();
        }, 500);

      }
      );
    }
  }
  CancelPrint() {
    // request to cancel the print
    this.setState(
      {
        cancelprint: true
      }
    );
    window.pywebview.api.CancelPrint();
  }

  StatusPrintEnd() {
    if (this.timer)
      clearInterval(this.timer);
    let msg = this.context.GetLocaleString("print.ended") + this.state.printstatus;
    this.setState({ comevent: msg });
  }
  RenderPendingBuild ()
  {
    if (this.state.pendingbuild)
      return (
        <img src={logo2} alt="loading" />
      );
      else
        return (
      <>
            <button className="pure-button " onClick={this.HandleDownload}>
                
              <FaDownload/>
              &nbsp;
            {this.context.GetLocaleString("print.download")}
          </button>
          &nbsp;
          <button className="pure-button  " onClick={this.HandlePrint}>
            <FaPrint />
            
            &nbsp;
            {this.context.GetLocaleString("print.print")}
          </button>
          &nbsp;
          <button className="pure-button " onClick={this.HandleRefresh}>
            <FaArrowRotateRight />
            
            &nbsp;
            {this.context.GetLocaleString("print.refresh")}
          </button>
        </>
      );

  }
  render() {
    return (
      <>
        <Modal
          isOpen={this.state.showModal}
          contentLabel=""
          aria={{ hidden: false, label: ' ' }}
        >
          <div aria-hidden={false} className='ModalView'>
            <p>
              {this.context.GetLocaleString("print.pending")}
            </p>
            <br />
            <p>
              {this.context.GetLocaleString("print.waiting")}
            </p>

            <button className="pad-button pure-button" onClick={this.CancelPrint}>
              {this.context.GetLocaleString("print.cancelbtn")}

            </button>
            <p>
              {this.state.cancelprint ? this.context.GetLocaleString("print.cancelpending") : ""}
            </p>

          </div>
        </Modal>
        <div className="Print">


          <div className="PrintCanvas">
            <canvas id="previewid" ref={this.canvasRef} hdmi resize>

            </canvas>
            {/*<div id="appLabel">{this.state.rightdim[0]}x{this.state.rightdim[1]}</div>*/}
          </div>
          <div className="PrintTitle">
            <h3>{this.state.buildstatus}</h3>
            {this.RenderPendingBuild()}

            
            <p>{this.context.Params.comport}</p>
            <h3>{this.state.comevent}</h3>
            
          </div>
        </div>
      </>


    );
  }
};

export default Print;