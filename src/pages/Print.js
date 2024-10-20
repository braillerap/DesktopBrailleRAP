import React from 'react';
import AppContext from '../components/AppContext';
import paper from 'paper';
import BrailleToGeometry from '../braillegeometry/BrailleToGeometry';
import GeomToGCode from '../braillegeometry/GeomToGCode';
import DotGrid from '../braillegeometry/dotgrid';
import GeomPoint from '../braillegeometry/GeomPoint';
//import FileSaver from 'file-saver';
import Modal from 'react-modal'
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa6";
//import WorkerFactory from '../components/workerfactory.js';
//import workertest from '../components/workertest.js';
//import workergeometry from '../components/workergeometry.js';
//import patterns from '../patterns/patterns.js';
import PageBuilder from '../braillegeometry/PageBuilder.js';
import PatternStrategy from '../components/patternstrategy.js';
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

  }

  componentDidMount() {

    //paper.setup(canvasRef.current);
    this.paper = new paper.PaperScope();
    this.paper.setup(this.canvasRef.current);

    this.paper.settings.insertItems = false;
    this.paper.settings.handleSize = 8;

    
    this.initPaper();
    this.buildpagedelay();
    
  }
  componentWillUnmount() {
    
    if (this.timer)
      clearTimeout(this.timer);
    if (this.timerbuild)
      clearTimeout(this.timerbuild);
    //workerinstance.terminate();
    
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
  

  
  buildpagedelay ()
  {
    this.setState({buildstatus:this.context.GetLocaleString("pattern.status.build")});
    this.setState({pendingbuild:true});
    this.timerbuild = setInterval(() => {
      this.buildpagetempo();
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
      let patternsvg = canv.getpatternsvg();
      
      let patstrategy = new PatternStrategy();
      
      patstrategy.setPatternAssociationDict(
        this.context.PatternFillRule === 0 ? this.context.PatternAssoc : this.context.PatternStrokeAssoc
      );
      
      //load patterns if needed
      if (patternsvg.length === 0 && patstrategy.isStrategyValid ())
      {
        console.log ("loading patterns");
        canv.loadPatterns();
        patternsvg = canv.getpatternsvg();
      }

      console.log ("construct page builder");
      let builder = new PageBuilder (canv, patternsvg, patstrategy, 
            this.context.Params, this.context.GetBrailleReverse(), this.context.PatternFillRule);
      
      
      console.log ("run page builder");
      this.ptcloud = builder.buildpage ();  // save dots for printing
    
      this.displaydotpreview(this.ptcloud);
    }
  }

  buildpageold() {
    let canv = this.context.GetPaperCanvas();
    let patstrategy = new PatternStrategy();
    patstrategy.setPatternAssociationDict(this.context.PatternAssoc);

    if (canv) {
      let patternsvg = canv.getpatternsvg();
      let GeomTotal = []
      let GeomBraille = [];
      let GeomVector = [];
      let GeomPattern = [];



      //load patterns if needed
      console.log ("patternsvg " + canv.getpatternsvg() + " " + canv.getpatternsvg().length);
      if (patternsvg.length === 0 && patstrategy.isStrategyValid ())
      {
        console.log ("loading patterns");
        canv.loadPatterns();
        patternsvg = canv.getpatternsvg();
      }

      // build braille and edge geometry
      let b = new BrailleToGeometry();

      let bounds = canv.paper.project.activeLayer.bounds;
      let element = canv.paper.project.activeLayer;
            
      this.plotItem(element,  bounds, GeomBraille, GeomVector);


      // init exclusion grid
      let f = new DotGrid(this.context.Params.Paper.usablewidth,
        this.context.Params.Paper.usableheight,
        this.context.Params.stepvectormm,
        this.context.Params.stepvectormm);
      f.setarray(GeomBraille);
      
      // filter edge geometry
      let FilteredVector = f.filter(GeomVector);

      // add filtered geometry to global geometry
      GeomTotal = GeomBraille.concat(FilteredVector);
      
      // build filling pattern geometry
      /* brut strategy*/
      /*
      if (canv.paper.project.activeLayer.children && patstrategy.isStrategyValid ())
      {
        this.FillPattern(element, bounds, GeomPattern, patstrategy, patternsvg);
        let FilteredPattern = f.filter(GeomPattern);
        GeomTotal = GeomTotal.concat(FilteredPattern);
      }
      */
      // hit test strategy
      
      if (canv.paper.project.activeLayer.children && patstrategy.isStrategyValid ())
      {
        let usedpattern = {};
        
        console.table(element);
        console.table(bounds);
        console.dir(patstrategy);
        console.dir(patternsvg);

        this.FillPatternList(element, bounds,  patstrategy, usedpattern, patternsvg);
        console.table(element);
        console.table(bounds);
        console.dir(patstrategy);
        console.dir(patternsvg);

        console.log ("used pattern ...");
        console.dir (usedpattern);
        console.log ("usedpattern " + JSON.stringify(usedpattern));
        
        for (const patternid in usedpattern)
        {
          console.log ("check pattern for id " + patternid);
          this.FillPatternHitTest (patternid, GeomPattern, patstrategy, patternsvg);
        }  
        let FilteredPattern = f.filter(GeomPattern);
        GeomTotal = GeomTotal.concat(FilteredPattern);
      }
      else
      {
        console.log (">>>>>>>>> no pattern");
        if (! canv.paper.project.activeLayer.children)
          console.log (">>>>>>>>>no children");
        if (!patstrategy.isStrategyValid ())
          console.log (">>>>>>>>>>>>>no strategy");
      }
     
      // sort dots on page
      let sorted = [];
      if (this.context.Params.ZigZagBloc === true) {
        sorted = b.SortGeomZigZagBloc(GeomTotal);
      }
      else
        sorted = b.SortGeomZigZag(GeomTotal);

      this.ptcloud = sorted;  // save dots for printing

      this.displaydotpreview(sorted);

    }
  }

  itemMustBeDrawn(item) {
    return (item.strokeWidth > 0 && item.strokeColor != null) || item.fillColor != null;
  }
  #reverse_string (str)
  {
      var rev = "";
      for (var i = str.length - 1; i >= 0; i--) {
          rev += str[i];
      }
      return rev;
  }

  FillPatternList(item, bounds, patstrategy, usedpattern, patternsvg) 
  {
    if (!item.visible) {
      console.log ("hidden item");
      return;
    }
    if (item.locked === true)
      return;
    console.log (item.className);
    if (item.className === 'Shape') {
      // element is shape => convert to path
      let shape = item;
      console.log ("shape in pattern");
      if (this.itemMustBeDrawn(shape)) {
        let path = shape.toPath(true);
        item.parent.addChildren(item.children);
        item.remove();
        item = path;
        console.log ("shape in pattern transformed");
      }
      else
      {
        console.log ("shape in pattern refused" + item.strokeWidth + " " + item.strokeColor + " " + item.fillColor + " " + item);
        console.log (item);
        
      }
    }
    
    if ((item.className === 'Path' ||
      item.className === 'CompoundPath') && item.strokeWidth > 0.001) 
    {
      let path = item;
      // item is path => build dots positions along all vectors
      if (path.fillColor)
      {
        console.log ("path.fillColor" + path.fillColor);

        let patternid = -1;
        
        if (patstrategy)
        {
          // find the associate pattern
          patternid = patstrategy.getPatternId(path.fillColor);
          if (patternid >= 0 && patternid < patternsvg.length)
          {
            console.log ("selected pattern " + patternid);
            usedpattern[patternid] = true;
        
          }  
        }
        else
          console.log ("no pattern strategy");
        
        
        
      }
      else
      {
        console.log ("path refused for pattern" + path);
        console.log (path);
      }
    }
    
    if (item.children == null) {
      return;
    }
    for (let child of item.children) {
      this.FillPatternList(child, bounds, patstrategy, usedpattern, patternsvg);
    }
  }

  FillPatternHitTest (patternid, GeomPattern, strategy, patternsvg)
  {
    const patfill = patternsvg[patternid];
    let canv = this.context.GetPaperCanvas();
    const hitOptions = {
      segments: true,
      stroke: false,
      fill: true,
      tolerance: 0
    };
    console.log ("test fill pattern id:" + patternid);
    if (patfill != null && patfill.children) {
      for (let childpat of patfill.children) {
        //if (childpat.name)
        //  console.log ("childpat.name " + childpat.name);
        //  console.log ("childpat.className  " + childpat.className);  
        if (childpat.className === 'CompoundPath') {
          for (let patseg of childpat.children) {
            //console.log ("patseg.className  " + patseg.className);  
            if (patseg.segments != null) {
              for (let i = 0; i < patseg.length; i += this.context.Params.stepvectormm) {
                let dot = patseg.getPointAt(i);
                let tdot = canv.paper.project.activeLayer.localToGlobal(dot);
                //console.log ("trying hittest path");
                let hitResult = canv.paper.project.hitTest(tdot, hitOptions);
                //console.log (hitResult);
                
                if (hitResult && hitResult.item) 
                  {
                    let item = hitResult.item;
                    console.log (item);
                  
                    if (hitResult.type === 'fill')
                    {
                      
                      if (item.fillColor)
                      {
                        //console.log ("item.fillColor " + item.fillColor);
                        if (strategy.getPatternId(item.fillColor) === patternid)
                        {
                          GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
                        }
                      }
                      
                    }
                  }
              }
            }
            else
              console.log("no segments in pattern");
          }


        }
        else if (childpat.className === 'Shape') {

          let patseg = childpat.toPath(true);
          if (patseg.segments != null) {
            for (let i = 0; i < patseg.length; i += this.context.Params.stepvectormm) {
              let dot = patseg.getPointAt(i);
              let tdot = canv.paper.project.activeLayer.localToGlobal(dot);
              let hitResult = canv.paper.project.hitTest(tdot, hitOptions);
              
              if (hitResult && hitResult.item) 
              {
                let item = hitResult.item;
                //console.log (item);
              
                if (hitResult.type === 'fill')
                {
                  
                  if (item.fillColor)
                  {
                    //console.log ("item.fillColor " + item.fillColor);
                    if (strategy.getPatternId(item.fillColor) === patternid)
                    {
                      GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
                    }
                  }
                  
                }
                else 
                {
                  console.log ("unknown hit result");
                  console.log (hitResult);
                }
              }

              
            }
          }
        }
      }

    }

  }
  

  FillPattern(item, bounds, GeomPattern, patstrategy, patternsvg) 
  {
    if (!item.visible) {
      return;
    }
    if (item.locked === true)
      return;
    
    if (item.className === 'Shape') {
      // element is shape => convert to path
      let shape = item;
      console.log ("shape in pattern");
      if (this.itemMustBeDrawn(shape)) {
        let path = shape.toPath(true);
        item.parent.addChildren(item.children);
        item.remove();
        item = path;
        console.log ("shape in pattern transformed");
      }
      else
        console.log ("shape in pattern refused" );
    }
    
    if ((item.className === 'Path' ||
      item.className === 'CompoundPath') && item.strokeWidth > 0.001) 
    {
      let path = item;
      // item is path => build dots positions along all vectors
      if (path.fillColor && path.closed)
      {
        console.log ("path.fillColor" + path.fillColor);

        let patternid = -1;
        let patfill = null;
        if (patstrategy)
        {
          // find the associate pattern
          patternid = patstrategy.getPatternId(path.fillColor);
          if (patternid >= 0 && patternid < patternsvg.length)
            patfill = patternsvg[patternid];
        }
        console.log ("selected pattern " + patternid);
        console.log ("selected pattern " + patfill);
        
        if (patfill != null && patfill.children)
        {
          for (let childpat of patfill.children) 
          {
            //if (childpat.name)
            //  console.log ("childpat.name " + childpat.name);
            //  console.log ("childpat.className  " + childpat.className);  
            if (childpat.className === 'CompoundPath')
            {
              for (let patseg of childpat.children)
              {
                //console.log ("patseg.className  " + patseg.className);  
                if (patseg.segments != null) 
                {
                  for (let i = 0; i < patseg.length; i += this.context.Params.stepvectormm) 
                  {
                    let dot = patseg.getPointAt(i);
                    
                    if (path.contains (dot))
                    {
                      console.log (dot);
                      GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
                    }
                  }
                }
                else
                  console.log ("no segments in pattern");
              }
              
        
            }
            else if (childpat.className === 'Shape')
            {
              
              let patseg = childpat.toPath(true);
              if (patseg.segments != null) 
              {
                for (let i = 0; i < patseg.length; i += this.context.Params.stepvectormm) 
                {
                  let dot = patseg.getPointAt(i);
                  
                  if (path.contains (dot))
                  {
                    console.log (dot);
                    GeomPattern.unshift(new GeomPoint(dot.x, dot.y));
                  }
                }
              }
            }
          }
          
        }
        
      }
    }
    
    if (item.children == null) {
      return;
    }
    for (let child of item.children) {
      this.FillPattern(child, bounds, GeomPattern, patstrategy, patternsvg)
    }
  }

  plotItem(item, bounds, GeomBraille, GeomVector) {
    if (!item.visible) {
      return
    }

    if (item.className === 'Shape') {
      // element is shape => convert to path
      let shape = item
      if (this.itemMustBeDrawn(shape)) {
        let path = shape.toPath(true);
        item.parent.addChildren(item.children);
        item.remove();
        item = path;
      }
    }
    if (item.locked === true)
      return;
    if ((item.className === 'PointText')) {
      // element is text => convert in Braille
      if (this.props.louis.isInit()) {
        let g = new BrailleToGeometry();

        // TODO : build a true translator to avoid inline translation
        let transcript = this.props.louis.unicode_translate_string(item.content, this.context.Params.brailletbl);
        if (this.context.GetBrailleReverse()) // some language : ie ARABIC are ltr language but RTL in Braille
          transcript = this.#reverse_string (transcript );

        let v = new this.paper.Point(item.handleBounds.topRight.x - item.handleBounds.topLeft.x,
          item.handleBounds.topRight.y - item.handleBounds.topLeft.y);

        let n = new this.paper.Point(item.handleBounds.bottomLeft.x - item.handleBounds.topLeft.x,
          item.handleBounds.bottomLeft.y - item.handleBounds.topLeft.y
        );

        v = v.rotate(item.rotation);
        n = n.rotate(item.rotation);
        v = v.normalize();
        n = n.normalize();

        let pts = g.BrailleStringToGeom(transcript, item.position.x, item.position.y, v.x, v.y, n.x, n.y);

        for (let i = 0; i < pts.length; i++)
          GeomBraille.push(pts[i]);
      }
    }
    if ((item.className === 'Path' ||
      item.className === 'CompoundPath') && item.strokeWidth > 0.001) {
      let path = item
      // item is path => build dots positions along all vectors
      if (path.segments != null) {
        for (let i = 0; i < path.length; i += this.context.Params.stepvectormm) {
          let dot = new this.paper.Path.Circle(path.getPointAt(i), 1);
          //GeomVector.push(new GeomPoint(dot.position.x, dot.position.y));
          // push in front to reverse Z order
          GeomVector.unshift(new GeomPoint(dot.position.x, dot.position.y));
        }
      }
    }
    if (item.children == null) {
      return;
    }
    for (let child of item.children) {
      this.plotItem(child, bounds, GeomBraille, GeomVector)
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